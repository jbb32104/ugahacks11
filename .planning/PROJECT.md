# Squirt Car

## What This Is

A pay-to-play web app for UGAHacks where users pay Solana to take 30-second turns driving a physical RC car equipped with a water cannon. Users watch a live video feed from the car's camera and control it with a virtual joystick, keyboard controls, and a dedicated squirt button. One driver at a time, with a queue system for waiting players.

## Core Value

Users can pay SOL, queue up, and seamlessly take control of a real car with live video feedback — the experience must feel responsive and fun during a live hackathon demo.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Auth0 Google sign-in with Solana wallet connection
- [ ] Supabase-backed user profiles and session management
- [ ] Live video feed from car camera displayed in browser
- [ ] Virtual on-screen joystick for touch/mouse control
- [ ] Keyboard controls (WASD/arrows) as fallback
- [ ] Dedicated "Squirt" button for water cannon
- [ ] WebSocket connection from app to Raspberry Pi for car commands
- [ ] Fixed SOL price per 30-second turn
- [ ] Queue system — one driver at a time, others wait in line
- [ ] Real-time queue position updates via Supabase Realtime
- [ ] Payment records logged in Supabase
- [ ] Turn timer with countdown visible to driver and spectators
- [ ] Component-based UI architecture

### Out of Scope

- Mobile-native app — web-only for hackathon
- Multiple simultaneous drivers — one at a time by design
- Variable pricing or bidding — fixed price per turn
- Chat or social features — focus on driving experience
- Persistent car state or replays — live-only

## Context

- **Event:** UGAHacks 11 hackathon — needs to work as a live demo
- **Hardware:** Raspberry Pi / ESP32 on the car, camera for video feed, pump/servo for water cannon
- **Car communication:** WebSocket from Next.js app to Pi on local network
- **Video streaming:** Approach TBD — needs to be low-latency for real-time control feel
- **Existing code:** Fresh Next.js scaffold with Tailwind CSS, no app logic yet
- **Solana integration:** Via Auth0 wallet connection, fixed-price turns

## Constraints

- **Tech stack**: Next.js + Supabase + Auth0 + Solana — user-specified, non-negotiable
- **Timeline**: Hackathon — must be demo-ready fast
- **Latency**: Video feed and controls must feel real-time (sub-500ms round trip ideal)
- **Network**: Car and app on same local network for WebSocket communication
- **Architecture**: Component-based UI — reusable, composable components

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase for all backend (queue, users, payments, realtime) | Single backend simplifies hackathon dev | — Pending |
| Auth0 for auth + wallet | Google sign-in + Solana wallet in one flow | — Pending |
| WebSocket to Pi | Direct, low-latency car communication on local network | — Pending |
| 30-second turns | Fast rotation keeps queue moving at hackathon | — Pending |
| Fixed SOL price | Simple payment model, no bidding complexity | — Pending |

---
*Last updated: 2026-02-06 after initialization*
