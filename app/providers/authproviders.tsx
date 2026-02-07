"use client";

import { useMemo } from "react";
import type {SolanaClientConfig} from "@solana/client";
import {SolanaProvider} from "./solanaprovider";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { AuthProvider } from "@/app/context/AuthContext";

import "@solana/wallet-adapter-react-ui/styles.css";

const defaultConfig: SolanaClientConfig = {
   cluster: "devnet",
  rpc: "https://api.devnet.solana.com",
  websocket: "wss://api.devnet.solana.com",
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const endpoint = useMemo(
    () =>
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl("devnet"),
    []
  );

  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <SolanaProvider>
      <AuthProvider>{children}</AuthProvider>
    </SolanaProvider>
  );
}
