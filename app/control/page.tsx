"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Soundboard } from "../components/Soundboard";

type Command = { type: string; [k: string]: any };

// Full state interface
interface ControlState {
  joystick_x: number;
  joystick_y: number;
  squirt: boolean;
  soundboard: string | null;
  timestamp: number;
}

export default function Page() {
  const router = useRouter();
  const joystickRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const wsControlRef = useRef<WebSocket | null>(null);
  const lastJoystickSent = useRef<number>(0);

  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(100);

  // Maintain full control state
  const controlStateRef = useRef<ControlState>({
    joystick_x: 0,
    joystick_y: 0,
    squirt: false,
    soundboard: null,
    timestamp: Date.now(),
  });

  // TIMER
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        if (newTime === 0) {
          router.push('/watch');
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  // CONTROL WEBSOCKET (port 8765)
  useEffect(() => {
    const PI_IP = "172.20.136.165";
    const CONTROL_PORT = "8765";

    try {
      const controlSocket = new WebSocket(`ws://${PI_IP}:${CONTROL_PORT}`);
      
      controlSocket.onopen = () => {
        console.log("Control WebSocket connected on port 8765");
        wsControlRef.current = controlSocket;
      };

      controlSocket.onclose = () => {
        console.log("Control WebSocket disconnected");
        wsControlRef.current = null;
      };

      controlSocket.onerror = (err) => {
        console.error("Control WebSocket error:", err);
      };

    } catch (e) {
      console.error("Failed to create control WebSocket:", e);
    }

    return () => {
      if (wsControlRef.current) {
        try {
          wsControlRef.current.close();
        } catch {}
        wsControlRef.current = null;
      }
    };
  }, []);

  // Helper to send full state over control WebSocket
  const sendFullState = () => {
    try {
      const socket = wsControlRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Control socket not open yet");
        return;
      }
      
      // Update timestamp
      controlStateRef.current.timestamp = Date.now();
      
      // Send full state as JSON string
      const stateJson = JSON.stringify(controlStateRef.current);
      socket.send(stateJson);
      console.log("Sent state:", stateJson);
    } catch (err) {
      console.error("Failed to send state:", err);
    }
  };

  // JOYSTICK
  useEffect(() => {
    if (!joystickRef.current) return;

    let manager: any;
    const initJoystick = async () => {
      const nipplejs = await import("nipplejs");
      manager = nipplejs.default.create({
        zone: joystickRef.current!,
        mode: "static",
        position: { left: "65%", bottom: "36%" },
        color: "gray",
        size: 230,
      });

      manager.on("move", (_evt: any, data: any) => {
        // Throttle joystick sends to ~10Hz
        const now = Date.now();
        if (now - lastJoystickSent.current < 100) return;
        lastJoystickSent.current = now;

        const vx = data?.vector?.x ?? 0;
        const vy = data?.vector?.y ?? 0;
        
        // Update state
        controlStateRef.current.joystick_x = vx;
        controlStateRef.current.joystick_y = vy;
        
        // Send full state
        sendFullState();
      });

      manager.on("end", () => {
        // Update state to neutral position when released
        controlStateRef.current.joystick_x = 0;
        controlStateRef.current.joystick_y = 0;
        
        // Send full state
        sendFullState();
      });
    };

    initJoystick();

    return () => {
      if (manager) manager.destroy();
    };
  }, []);

  // LIVESTREAM
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jsmpeg.com/jsmpeg.min.js";
    script.async = true;

    script.onload = () => {
      if (canvasRef.current) {
        const PI_IP = "172.20.136.165";
        const WS_PORT = "9000";
        const SECRET = "test123";

        try {
          // @ts-ignore
          const player = new JSMpeg.Player(`ws://${PI_IP}:${WS_PORT}/${SECRET}`, {
            canvas: canvasRef.current,
            autoplay: true,
            audio: false,
            onSourceEstablished: () => {
              setIsConnected(true);
            },
          });

          playerRef.current = player;

          // Store the video stream WebSocket reference
          const maybeWs =
            (player as any)?.source?.ws ||
            (player as any)?.source?.socket ||
            (player as any)?.ws ||
            (player as any)?.socket ||
            null;

          if (maybeWs instanceof WebSocket) {
            wsRef.current = maybeWs;
          }

          // store reference for cleanup
          (canvasRef.current as any).player = player;
        } catch (err) {
          console.error("Failed to create player:", err);
        }
      }
    };

    document.body.appendChild(script);

    return () => {
      if (canvasRef.current && (canvasRef.current as any).player) {
        (canvasRef.current as any).player.destroy();
      }
      if (script.parentNode) document.body.removeChild(script);
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {}
        wsRef.current = null;
      }
    };
  }, []);

  // Updated command handler for backward compatibility
  const sendCommand = (cmd: Command) => {
    // Update state based on command type
    if (cmd.type === "joystick") {
      controlStateRef.current.joystick_x = cmd.x ?? 0;
      controlStateRef.current.joystick_y = cmd.y ?? 0;
    } else if (cmd.type === "squirt") {
      controlStateRef.current.squirt = true;
      console.log("SQUIRT command received");
      // Auto-reset squirt after sending
      setTimeout(() => {
        controlStateRef.current.squirt = false;
        sendFullState();
      }, 100);
    } else if (cmd.type === "soundboard") {
      controlStateRef.current.soundboard = cmd.sound ?? null;
      // Auto-reset soundboard after sending
      setTimeout(() => {
        controlStateRef.current.soundboard = null;
        sendFullState();
      }, 100);
    }
    
    // Send full state
    sendFullState();
  };

  // SQUIRT click handler
  const handleSquirt = () => {
    sendCommand({ type: "squirt" });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col items-start justify-start text-center px-6 gap-6 pt-20 ml-0 md:ml-8">
        <div className="mb-6 text-center ml-65">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <canvas ref={canvasRef} width="640" height="480" className="w-full h-auto" />
        </div>
      </main>

      <div ref={joystickRef} id="joystick-zone"></div>

      {/* Large stopwatch above SQUIRT */}
      
      <div className="absolute" style={{ left: "50%", bottom: "55%", marginLeft: "150px" }}>
        <div className="bg-gray-900 border-4 border-amber-500 rounded-lg px-12 py-8 shadow-lg" style={{ boxShadow: "0 0 20px rgba(217, 119, 6, 0.3)" }}>
          <div className="text-8xl font-mono font-bold text-amber-400 tracking-wider">{formattedTime}</div>
        </div>
      </div>

      <button
        onMouseDown={handleSquirt}
        className="absolute bg-red-600 hover:bg-red-700 text-white font-bold py-10 px-20 rounded text-2xl"
        style={{
          left: "67%",
          bottom: "29%",
          marginLeft: "150px",
          zIndex: 50,
        pointerEvents: "auto",
        }}>
        SQUIRT
      </button>


      {/* Pass sendCommand to Soundboard so its buttons send commands */}
      <Soundboard sendCommand={sendCommand} />
    </div>
  );
}