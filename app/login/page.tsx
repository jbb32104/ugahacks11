import Link from "next/link";
import { login } from "@/app/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Squirt Car
          </Link>
          <h1 className="text-2xl font-bold mt-4">Sign In</h1>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-white/30 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-white/30 transition-colors"
              placeholder="Your password"
            />
          </div>

          <button
            formAction={login}
            className="rounded-lg bg-white text-black px-4 py-2.5 text-sm font-medium hover:bg-white/90 transition-colors mt-2"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-foreground/50">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
