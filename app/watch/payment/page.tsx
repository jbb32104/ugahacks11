"use client";
import { WalletConnectButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";
import { SolTransferCard } from "@/app/components/soltransfer";
import { WalletProvider } from "@solana/wallet-adapter-react";

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
            <div className="max-w-2xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center">

                <h1 className="text-4xl font-bold text-white mb-4">
                    Payment Page
                </h1>
                <p className="text-gray-400 mb-6">
                    This is where users can make payments to drive the RC car.
                </p>
                    <WalletConnectButton/>
            </div>
        </div>
    );
}