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
          <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

          {/* Email/Password Login */}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              required
            />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              required
            />
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/20 border border-white/20 text-gray-300 rounded-lg shadow-md hover:shadow-lg hover:bg-white/20 transition-all font-medium hover:scale-105"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="mt-3">
            <Web3LoginButton />
          </div>

          {/* Sign Up Redirect */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don&apos;llt have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="font-semibold text-amber-400 hover:underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
          <div className="mt-2 text-center text-sm text-gray-400">
            Forgot your password?{" "}
            <Link
              href="/auth/forgot-password"
              className="font-semibold text-amber-400 hover:underline underline-offset-4"
            >
              Reset it
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
