# Pitch or Pass

A serious game for entrepreneurship students to practice the art of pitching to investors. Play as a startup founder, pitch five investor personas, and secure funding from at least three of them — or your startup goes home empty-handed.

Built for the DTU *Developing an Entrepreneurial Mindset* course.

---

## What is it?

Pitch or Pass teaches rhetorical strategy through gameplay. Each investor has a hidden preference for one of three classical modes of persuasion — **Ethos** (credibility), **Pathos** (emotion), or **Logos** (logic). Players draw pitch cards, select three per round, deliver a live 90-second spoken pitch, and receive AI-powered investor feedback.

Five rounds. Three wins to get funded. No second chances.

---

## Features

- **5 investor personas** — each with distinct psychology and hidden rhetorical preferences
- **9 pitch cards** across Ethos, Pathos, and Logos categories
- **10 randomly assigned startups** to pitch (NapDesk, GriefBot, WillBot, and more)
- **Live speech recording** with 90-second timer and real-time waveform visualization
- **Speech-to-text transcription** via Web Speech API (Whisper if backend is available)
- **AI-powered investor responses** — reacts to card selection, speech content, and your reputation
- **Reputation score** that compounds across rounds — failures make later rounds harder
- **Game history** persisted in localStorage with JSON export
- **Offline-first** — runs fully in-browser without any backend

---

## Investors

| Persona | Prefers | Hint |
|---|---|---|
| 📐 The Skeptical Professor | Logos | Data, logic, evidence |
| 🚀 The Excited Tech VC | Pathos | Vision, energy, disruption |
| 🏦 The Risk-Averse Banker | Ethos | Credibility, track record |
| 🛒 The Customer Advocate | Pathos | Human problems, real impact |
| 💼 The Angel Investor | Ethos + Logos | Balanced, well-rounded pitch |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| State | Zustand |
| Build | Vite |
| Styles | Custom CSS (dark theme) |
| Speech | Web Speech API + MediaRecorder |
| Storage | localStorage |
| Deploy | Netlify + GitHub Actions |
| Backend (optional) | Any HTTP API at `/api` (Whisper transcription, AI evaluation) |

---

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Production backend URL
# Leave empty in local dev — Vite proxy forwards /api → localhost:8000
VITE_API_URL=https://your-tunnel.trycloudflare.com/api
```

In development, the Vite proxy automatically forwards `/api` requests to `localhost:8000`. No `.env` changes needed for local development.

---

## Project Structure

```
src/
├── screens/           # Full-page views (Landing, Setup, Game, End)
├── components/
│   ├── game/          # TopBar, InvestorPanel, StartupPanel, CardHand, SelectedSlots
│   └── overlays/      # SpeechOverlay (mic + timer), ResponseOverlay (verdict)
├── store/
│   └── gameStore.ts   # Zustand state — rounds, reputation, overlays, session
├── hooks/             # useSpeech, useAudioRecorder, useTimer, useWaveform
├── api/
│   └── client.ts      # Backend fetch wrappers
├── lib/
│   └── history.ts     # localStorage persistence + JSON export
├── data/
│   └── gameData.ts    # Investors, startups, cards, local evaluation logic
└── types/
    └── index.ts       # Shared TypeScript interfaces
```

---

## How the Game Works

1. **Setup** — Enter your name
2. **Each Round:**
   - Draw 7 pitch cards, select 3 to play
   - Deliver a 90-second spoken pitch (or type it)
   - Investor evaluates your cards + pitch content
   - Funded (+5 rep) or Passed (-12 rep)
3. **End Screen** — See your full session breakdown, per-round analysis, and rhetorical alignment scores

The reputation score starts at 100. Losing rounds compounds difficulty — a low rep increases pass probability in later rounds, just like real life.

---

## Backend (Optional)

The game runs fully offline using local evaluation logic. When a backend is available, it unlocks:

- Whisper-based audio transcription
- AI-generated investor responses based on pitch content

The backend health is checked on startup. If unreachable, the game silently falls back to local mode.

---

## Deployment

Deployments are automated via GitHub Actions:

- **Pull request to `main`** → Netlify preview deploy
- **Push to `main`** → Netlify production deploy

Required GitHub secrets: `VITE_API_URL`, `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`.

---

## License

MIT
