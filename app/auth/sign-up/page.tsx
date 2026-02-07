"use client";

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Home } from "lucide-react";
import Web3LoginButton from "@/app/auth/components/Web3LoginButton";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Email/Password Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      router.push("/watch");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign Up (same as login)
  const handleGoogleSignUp = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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

      <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-amber-500/10 to-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Form container */}
        <div className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl my-20">
          <div className="text-center mb-8">
            <p className="text-gray-400">Create your account</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 ring-amber-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 ring-amber-400 transition"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="repeat-password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="repeat-password"
                type="password"
                placeholder="Repeat your password"
                required
                minLength={8}
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 ring-amber-400 transition"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? "Creating your account..." : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-700" />
            <span className="px-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-700" />
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white/20 border border-white/20 text-gray-300 rounded-lg shadow-md hover:shadow-lg hover:bg-white/20 transition-all font-medium hover:scale-105"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          <div className="mt-3">
            <Web3LoginButton />
          </div>

          {/* Sign In Redirect */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-amber-400 hover:underline underline-offset-4"
            >
              Sign in
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
            <ArrowLeft size={20} />
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
