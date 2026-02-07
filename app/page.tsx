"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";
export default function Page() {
  const user  = useAuth();
  const router = useRouter();
  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <Navbar />

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 gap-6 pt-20">
        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Squirt Car
          </h1>
          <p className="text-lg text-gray-400">
            Pay SOL. Drive an RC car. Squirt people with a water cannon.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105" onClick = {user?() => router.push("/auth/login") : () => router.push("/control")}>
            Join the Queue
          </button>
          <Link
            href="/watch"
            className="px-6 py-3 bg-white/5 border border-white/20 rounded-lg font-semibold text-gray-300 hover:bg-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
          >
            Watch Live
          </Link>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
          <div className="flex flex-col items-center gap-2 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="text-3xl font-bold text-amber-400">1</div>
            <h3 className="font-semibold">Pay SOL</h3>
            <p className="text-sm text-gray-400">
              Connect your wallet and pay a fixed price for a 30-second turn.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="text-3xl font-bold text-amber-400">2</div>
            <h3 className="font-semibold">Queue Up</h3>
            <p className="text-sm text-gray-400">
              Wait your turn. Watch the live feed while others drive.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="text-3xl font-bold text-amber-400">3</div>
            <h3 className="font-semibold">Drive & Squirt</h3>
            <p className="text-sm text-gray-400">
              Take the wheel. Use the joystick to drive and hit the squirt
              button.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-sm text-gray-500 py-6">
        Built for UGAHacks 11
      </footer>
    </div>
  );
}
