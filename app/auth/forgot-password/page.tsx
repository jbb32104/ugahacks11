"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Home } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
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
          {success ? (
            // Success State
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                  Lux
                </h1>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Check Your Email
                </h2>
                <p className="text-gray-400">
                  Password reset instructions sent
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <p className="text-sm text-green-300">
                    If you registered using your email and password, you will
                    receive a password reset email.
                  </p>
                </div>

                <div className="text-center text-sm text-gray-400">
                  Didn&apos;t receive an email?{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="font-semibold text-amber-400 hover:underline underline-offset-4"
                  >
                    Try again
                  </button>
                </div>

                <div className="text-center text-sm text-gray-400">
                  Remember your password?{""}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-amber-400 hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </>
          ) : (
            // Form State
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                  Lux
                </h1>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Reset Your Password
                </h2>
                <p className="text-gray-400">
                  Type in your email and we&apos;ll send you a link to reset
                  your password
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
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

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Send Reset Email Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-75 disabled:transform-none"
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>

              {/* Navigation Links */}
              <div className="mt-6 space-y-3">
                <div className="text-center text-sm text-gray-400">
                  Remember your password?{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-amber-400 hover:underline underline-offset-4"
                  >
                    Sign in
                  </Link>
                </div>
                <div className="text-center text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="font-semibold text-amber-400 hover:underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </>
          )}
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
