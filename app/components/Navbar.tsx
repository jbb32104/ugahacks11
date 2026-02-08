"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Home, LogOut } from "lucide-react";

function getDisplayName(email: string): string {
  return email.split("@")[0];
}

export default function Navbar() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors"
      >
        Sqwerty
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-gray-400 hover:text-amber-400 transition-colors"
        >
          <Home size={20} />
        </Link>

        {loading ? (
          <div className="h-5 w-24 bg-white/10 rounded animate-pulse" />
        ) : user ? (
          <>
            <span className="text-sm text-gray-300">
              Welcome,{" "}
              <span className="text-amber-400 font-medium">
                {getDisplayName(user.email ?? "")}
              </span>
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-1.5 text-sm font-medium hover:shadow-lg hover:shadow-amber-400/25 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
