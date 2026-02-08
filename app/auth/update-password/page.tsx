"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Home, Eye, EyeOff } from "lucide-react";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);

      // Redirect after a brief success message
      setTimeout(() => {
        router.push("/complete-your-profile");
      }, 2000);
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
                  Sqwerty
                </h1>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Password Updated!
                </h2>
                <p className="text-gray-400">
                  Your password has been successfully updated
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-300 mb-2">
                    ✓ Your password has been updated successfully
                  </p>
                  <p className="text-xs text-gray-400">
                    Redirecting you to your dashboard...
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">Redirecting...</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Form State
            <>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold tracking-wider bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                  Sqwerty
                </h1>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Update Your Password
                </h2>
                <p className="text-gray-400">
                  Please enter your new password below
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-6">
                {/* New Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 ring-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repeat your new password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-1 ring-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Password Strength</span>
                      <span
                        className={`font-medium ${
                          password.length >= 12
                            ? "text-green-400"
                            : password.length >= 8
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {password.length >= 12
                          ? "Strong"
                          : password.length >= 8
                            ? "Good"
                            : "Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          password.length >= 12
                            ? "bg-green-400 w-full"
                            : password.length >= 8
                              ? "bg-yellow-400 w-2/3"
                              : "bg-red-400 w-1/3"
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Update Password Button */}
                <button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-lg font-semibold text-black hover:shadow-2xl hover:shadow-amber-400/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      Updating Password...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>

              {/* Navigation Links */}
              <div className="mt-6 text-center text-sm text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="font-semibold text-amber-400 hover:underline underline-offset-4"
                >
                  Sign in instead
                </Link>
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
