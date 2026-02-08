"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useRouter } from "next/navigation";
import bs58 from "bs58";
import { createClient } from "@/utils/supabase/client";

const SIGN_MESSAGE = "Sign in to Sqwerty Car";

export default function Web3LoginButton() {
  const { publicKey, signMessage, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleClick = useCallback(async () => {
    setError(null);

    if (!connected || !publicKey) {
      setVisible(true);
      return;
    }

    if (!signMessage) {
      setError("Wallet does not support message signing");
      return;
    }

    setIsLoading(true);

    try {
      const messageBytes = new TextEncoder().encode(SIGN_MESSAGE);
      const signatureBytes = await signMessage(messageBytes);
      const signature = bs58.encode(signatureBytes);

      const res = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          signature,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Wallet authentication failed");
      }

      // If cookies didn't stick, set session client-side as fallback
      if (data.session) {
        const supabase = createClient();
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

      router.push("/payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet sign-in failed");
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, signMessage, setVisible, router]);

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 border border-purple-400/30 text-white rounded-lg shadow-md hover:shadow-lg hover:shadow-purple-500/20 transition-all font-medium hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
      >
        <svg width="20" height="20" viewBox="0 0 128 128" fill="none">
          <circle
            cx="64"
            cy="64"
            r="64"
            fill="currentColor"
            fillOpacity="0.15"
          />
          <path
            d="M44.2 90.5c-2.2 0-4.2-.8-5.8-2.4a8.1 8.1 0 0 1-2.4-5.8V45.7c0-2.2.8-4.2 2.4-5.8a8.1 8.1 0 0 1 5.8-2.4h39.6c2.2 0 4.2.8 5.8 2.4a8.1 8.1 0 0 1 2.4 5.8v4.5h-8.2v-4.5H44.2v36.6h39.6v-4.5H92v4.5c0 2.2-.8 4.2-2.4 5.8a8.1 8.1 0 0 1-5.8 2.4H44.2Zm31.3-18.3-5.8-5.7 5.3-5.3H55.5v-8.2H75l-5.3-5.3 5.8-5.7L90.7 57 75.5 72.2Z"
            fill="currentColor"
          />
        </svg>
        {isLoading
          ? "Connecting..."
          : connected
            ? "Sign with Wallet"
            : "Continue with Web3"}
      </button>
      {error && (
        <p className="mt-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-2">
          {error}
        </p>
      )}
    </div>
  );
}
