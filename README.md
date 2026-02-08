# Sqwerty

**Pay SOL. Drive an RC car. Squirt people with a water cannon.**

Sqwerty is a real-time interactive web app built for [UGAHacks 11](https://ugahacks.com) that lets users pay Solana to take turns driving a remote-controlled car equipped with a water cannon. Watch the live stream, join the queue, and when your turn comes — drive, squirt, and play sounds, all from your browser.

## How It Works

1. **Pay SOL** — Connect your Phantom wallet and send a small Solana payment (devnet) to join the queue.
2. **Queue Up** — Wait your turn while watching the live Twitch stream of the RC car.
3. **Drive & Squirt** — Control the car with a virtual joystick, fire the water cannon, and trigger sound effects for 30 seconds.

## Tech Stack

| Layer     | Technology                                                            |
| --------- | --------------------------------------------------------------------- |
| Frontend  | Next.js 16, React 19, TypeScript, Tailwind CSS 4                      |
| Auth      | Supabase Auth (email/password, Google OAuth, Solana wallet signature) |
| Database  | Supabase (PostgreSQL)                                                 |
| Payments  | Solana web3.js, Phantom Wallet Adapter                                |
| Streaming | Twitch embed (remote) / jsmpeg over WebSocket (local Pi)              |
| Controls  | nipplejs (joystick), WebSocket JSON commands                          |
| Hardware  | Raspberry Pi, GPIO (motors, water pump relay, speakers)               |

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── auth/                    # Login, sign-up, forgot/update password, wallet auth
├── watch/
│   ├── page.tsx             # Live Twitch stream viewer
│   └── payment/page.tsx     # Solana payment to join queue
├── queue/page.tsx           # Queue position & management
├── control/page.tsx         # RC car control interface (joystick, squirt, soundboard)
├── payment/page.tsx         # Standalone payment page
├── components/              # Navbar, Soundboard
├── context/AuthContext.tsx   # Auth state provider
└── api/auth/wallet/route.ts # Web3 wallet signature verification

utils/supabase/              # Supabase client, server, admin, queue helpers
squirtastic.py               # Testing Raspberry Pi controller (receives WebSocket commands)
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- [Phantom Wallet](https://phantom.app) browser extension (for Solana payments)

### Installation

```bash
git clone https://github.com/jbb32104/ugahacks11.git
cd ugahacks11
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
WALLET_AUTH_SECRET=<random-hex-string-for-wallet-auth>
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOL_RECIPIENT=<recipient-wallet-public-key>
```

### Run

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Hardware Setup

The RC car is controlled by a Raspberry Pi that receives commands over WebSocket:

- **Port 9000** — jsmpeg video stream
- **Port 8765** — JSON control commands (joystick, squirt, sound)

## Authentication

Sqwerty supports three sign-in methods:

- **Email/Password** — Standard Supabase auth
- **Google OAuth** — One-click Google sign-in
- **Solana Wallet** — Sign a message with Phantom to authenticate (no email required)

## Built at UGAHacks 11
