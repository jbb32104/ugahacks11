import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="text-lg font-bold tracking-tight">Squirt Car</span>
        <Link
          href="/auth/login"
          className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Login
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-6">
        <div className="flex flex-col gap-3 max-w-xl">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
            Squirt Car
          </h1>
          <p className="text-lg text-foreground/60">
            Pay SOL. Drive an RC car. Squirt people with a water cannon.
          </p>
        </div>

        <div className="flex gap-3 mt-2">
          <button className="rounded-full bg-white text-black px-6 py-3 font-medium hover:bg-white/90 transition-colors">
            Join the Queue
          </button>
          <Link
            href="/watch"
            className="rounded-full border border-white/20 px-6 py-3 font-medium hover:bg-white/5 transition-colors"
          >
            Watch Live
          </Link>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-2xl w-full">
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="text-3xl">1</div>
            <h3 className="font-semibold">Pay SOL</h3>
            <p className="text-sm text-foreground/50">
              Connect your wallet and pay a fixed price for a 30-second turn.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="text-3xl">2</div>
            <h3 className="font-semibold">Queue Up</h3>
            <p className="text-sm text-foreground/50">
              Wait your turn. Watch the live feed while others drive.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <div className="text-3xl">3</div>
            <h3 className="font-semibold">Drive & Squirt</h3>
            <p className="text-sm text-foreground/50">
              Take the wheel. Use the joystick to drive and hit the squirt
              button.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-foreground/30 py-6">
        Built for UGAHacks 11
      </footer>
    </div>
  );
}
