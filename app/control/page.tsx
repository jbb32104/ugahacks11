"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { Soundboard } from "../components/Soundboard";

type Command = { type: string; [k: string]: any };

export default function Page() {
  const router = useRouter();
  const joystickRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastJoystickSent = useRef<number>(0);

  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Timer and redirect
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

  // ... rest of your code remains the same

  // Initialize joystick (nipplejs)
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
        sendCommand({ type: "joystick", x: vx, y: vy });
      });

      manager.on("end", () => {
        // send neutral position when released
        sendCommand({ type: "joystick", x: 0, y: 0 });
      });
    };

    initJoystick();

    return () => {
      if (manager) manager.destroy();
    };
  }, []);

  // Load JSMpeg and create player; capture underlying WebSocket for sending
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

          // Attempt to find the internal WebSocket instance used by JSMpeg.
          // Different JSMpeg builds expose it under different property names.
          const maybeWs =
            (player as any)?.source?.ws ||
            (player as any)?.source?.socket ||
            (player as any)?.ws ||
            (player as any)?.socket ||
            null;

          if (maybeWs instanceof WebSocket) {
            wsRef.current = maybeWs;
          } else {
            // If player created its own WebSocket internally but didn't expose it,
            // create a secondary control socket to same URL. This requires server support.
            try {
              const controlSocket = new WebSocket(`ws://${PI_IP}:${WS_PORT}/${SECRET}`);
              controlSocket.onopen = () => {
                wsRef.current = controlSocket;
              };
              controlSocket.onclose = () => {
                if (wsRef.current === controlSocket) wsRef.current = null;
              };
            } catch (e) {
              console.warn("Control websocket fallback failed", e);
            }
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

  // Helper to send JSON commands over the control WebSocket
  const sendCommand = (cmd: Command) => {
    try {
      const socket = wsRef.current;
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Control socket not open yet:", cmd);
        return;
      }
      socket.send(JSON.stringify(cmd));
    } catch (err) {
      console.error("Failed to send command:", err);
    }
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
        onClick={handleSquirt}
        className="absolute bg-red-600 hover:bg-red-700 text-white font-bold py-10 px-20 rounded text-2xl"
        style={{ left: "67%", bottom: "29%", marginLeft: "150px" }}
      >
        SQUIRT
      </button>

      {/* Pass sendCommand to Soundboard so its buttons send commands */}
      <Soundboard sendCommand={sendCommand} />
    </div>
  );
}