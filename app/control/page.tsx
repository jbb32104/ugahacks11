"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Soundboard } from "../components/Soundboard";

export default function Page() {
    const joystickRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!joystickRef.current) return;

    let manager: any;
    const initJoystick = async () => {
      const nipplejs = await import('nipplejs');
      manager = nipplejs.default.create({
        zone: joystickRef.current!,
        mode: 'static',
        position: { left: '65%', bottom: '36%' },
        color: 'gray',
        size: 230,
      });

      manager.on('move', (evt: any, data: any) => {
        console.log(data.vector); // Output x, y movement
      });
    };

    initJoystick();

    return () => {
      if (manager) manager.destroy();
    };
  }, []);

    useEffect(() => {
      // Load JSMpeg script
      const script = document.createElement("script");
      script.src = "https://jsmpeg.com/jsmpeg.min.js";
      script.async = true;

      script.onload = () => {
        if (canvasRef.current) {
          // Replace with your Raspberry Pi's IP address
          const PI_IP = "172.20.136.165"; // e.g., '192.168.1.100'
          const WS_PORT = "9000";
          const SECRET = "test123"; // Default secret
  
          try {
            // @ts-ignore
            const player = new JSMpeg.Player(
              `ws://${PI_IP}:${WS_PORT}/${SECRET}`,
              {
                canvas: canvasRef.current,
                autoplay: true,
                audio: false,
                onSourceEstablished: () => {
                  setIsConnected(true);
                },
              },
            );
  
            // Store player for cleanup
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
        document.body.removeChild(script);
      };
    }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Navbar />

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-start justify-start text-center px-6 gap-6 pt-20 ml-0 md:ml-8">
        <div className="mb-6 text-center ml-65">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isConnected
                ? "bg-green-900 text-green-200"
                : "bg-red-900 text-red-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-400" : "bg-red-400"
              }`}
            />
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="w-full h-auto"
          />
        </div>
      </main>
      <div ref={joystickRef} id="joystick-zone"></div>
      
      {/* Digital Watch Timer */}
      <div className="absolute" style={{ left: '55%', bottom: '60%', marginLeft: '150px' }}>
        <div className="bg-gray-900 border-4 border-amber-500 rounded-lg px-12 py-8 shadow-lg" style={{ boxShadow: '0 0 20px rgba(217, 119, 6, 0.3)' }}>
          <div className="text-8xl font-mono font-bold text-amber-400 tracking-wider">
            {formattedTime}
          </div>
        </div>
      </div>

      <button className="absolute bg-red-600 hover:bg-red-700 text-white font-bold py-10 px-20 rounded text-2xl" style={{ left: '67%', bottom: '29%', marginLeft: '150px' }}>
        SQUIRT
      </button>
      <Soundboard />
    </div>
  );
}