// app/watch/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function WatchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Pi Camera Stream
        </h1>

        <div className="mb-6 text-center">
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

        <div className="mt-4 text-gray-400 text-sm text-center">
          Streaming from Raspberry Pi
        </div>
      </div>
    </div>
  );
}
