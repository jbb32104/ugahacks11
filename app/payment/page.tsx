'use client';
import React, { useState } from 'react';
import Navbar from '../../app/components/Navbar';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import router from 'next/dist/shared/lib/router/router';

export default function PaymentPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connect, connected } = useWallet();

  const [amountSol, setAmountSol] = useState<string>('0.01');
  const [recipient, setRecipient] = useState<string>(process.env.NEXT_PUBLIC_SOL_RECIPIENT ?? '');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const network = process.env.NEXT_PUBLIC_SOL_NETWORK ?? 'devnet'; // 'devnet' | 'mainnet-beta' | 'testnet'

  const explorerBase = (sig: string) =>
    `https://explorer.solana.com/tx/${sig}?cluster=${network}`;

  const handlePay = async () => {
    setStatus(null);

    if (!publicKey) {
      try {
        await connect();
      } catch (err: any) {
        setStatus(`Wallet connect failed: ${err?.message ?? err}`);
        return;
      }
      if (!publicKey) {
        setStatus('Wallet not connected');
        return;
      }
    }

    if (!recipient) {
      setStatus('Please set a recipient public key.');
      return;
    }

    let toPub: PublicKey;
    try {
      toPub = new PublicKey(recipient);
    } catch {
      setStatus('Invalid recipient PublicKey.');
      return;
    }

    const amount = parseFloat(amountSol);
    if (Number.isNaN(amount) || amount <= 0) {
      setStatus('Enter a valid positive amount in SOL.');
      return;
    }

    const lamports = Math.round(amount * LAMPORTS_PER_SOL);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: toPub,
        lamports,
      }),
    );

    try {
      setLoading(true);
      setStatus('Sending transaction (wallet will prompt)...');

      // sendTransaction will trigger the connected wallet to sign/send
      const signature = await sendTransaction(tx, connection);

      setStatus(`Transaction submitted: ${signature}. Waiting for confirmation...`);

      await connection.confirmTransaction(signature, 'confirmed');

      setStatus(`Payment confirmed — tx: ${signature}`);
      // Optionally open explorer in new tab:
      // window.open(explorerBase(signature), '_blank');

    } catch (err: any) {
      setStatus(`Transaction failed: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Pay with Solana</h2>

        <label className="block mb-2 text-sm text-gray-300">Recipient Public Key</label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Paste recipient public key (or set NEXT_PUBLIC_SOL_RECIPIENT)"
          className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />

        <label className="block mb-2 text-sm text-gray-300">Amount (SOL)</label>
        <input
          value={amountSol}
          onChange={(e) => setAmountSol(e.target.value)}
          className="w-40 mb-4 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handlePay}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded"
          >
            {loading ? 'Processing...' : 'Pay'}
          </button>

          <div className="text-sm text-gray-300">
            Wallet: {connected && publicKey ? `${publicKey.toBase58().slice(0, 6)}...` : 'Not connected'}
          </div>
        </div>

        {status && (
          <div className="mt-4 text-sm">
            <div className="text-gray-200">{status}</div>
            {/* If status contains a signature, optionally show a link */}
            {status.startsWith('Payment confirmed — tx: ') && (
              <div className="mt-2">
                <a
                  href={explorerBase(status.replace('Payment confirmed — tx: ', ''))}
                  target="/control"
                  rel="noreferrer"
                  className="text-amber-400 underline"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}