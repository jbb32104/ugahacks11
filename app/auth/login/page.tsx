"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Home } from "lucide-react";
import Web3LoginButton from "@/app/auth/components/Web3LoginButton";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/`, // callback route
      },
    });

    if (error) setError(error.message);
  };

  return (
    <>
      <style jsx>{`
        .back-button-desktop {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .back-button-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .back-button-desktop {
            display: none;
          }

          .back-button-mobile {
            display: flex;
            align-items: center;
          }
        }
      `}</style>

      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white">
        {/* Form card */}
        <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-6">Sign In with Web3 Wallet</h1>

          <div className="mt-3">
            <Web3LoginButton />
          </div>

          {/* Sign Up Redirect */}
          <div className="m-6 text-center text-lg text-gray-400">
            Don't have an account?{" "}
            </div>
            <div className="flex flex-colmt-2 gap-2 text-center text-sm text-gray-400">
            <Link
              href="/watch"
              className="text-md p-2 rounded border-2 border-white font-semibold text-amber-400 hover:underline underline-offset-4"
            >
              Watch others control Sqwerty!
            </Link>
            <Link
              href="https://phantom.com/learn/guides/how-to-create-a-new-wallet"
              className="text-md p-2 rounded border-2 border-white font-semibold text-amber-400 hover:underline underline-offset-4"
            >
              Create a wallet with Phantom!
            </Link>
          </div>
        </div>

        {/* Back to Home Button - Custom Responsive */}
        <Link
          href="/"
          className="fixed bottom-6 left-6 text-gray-400 hover:text-amber-400 transition-colors z-50"
        >
          {/* Desktop version */}
          <div className="back-button-desktop">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </div>

          {/* Mobile version */}
          <div className="back-button-mobile">
            <Home size={24} />
          </div>
        </Link>
      </div>
    </>
  );
}
