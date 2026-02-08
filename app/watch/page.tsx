"use client";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function WatchPage() {
  const [isConnected, setIsConnected] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePaymentClick = () => {
    console.log("User:", user); // Debug log
    if (user) {
      router.push("/watch/payment");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <Navbar />
        <h1 className="text-4xl font-bold text-white mb-2 text-center pt-20">
          Live Stream
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
            {isConnected ? "Stream Loaded" : "Loading Stream"}
          </span>
        </div>
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            title="Live Stream"
            src={`https://player.twitch.tv/?channel=mrmlgsniper&parent=www.sqwerty.tech`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0 rounded-lg shadow-2xl"
            onLoad={() => setIsConnected(true)}
          />
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105"
          onClick={() =>
            user ? router.push("/watch/payment") : router.push("/auth/login")
          }
        >
          Join the Queue
        </button>
        <div className="mt-4 text-gray-400 text-sm text-center">
          Streaming from twitch.tv
        </div>
      </div>
    </div>
  );
}
