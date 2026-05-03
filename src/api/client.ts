import type { Card, InvestorResponse, SessionState } from '../types'

// In production (Netlify): set VITE_API_URL to your Cloudflare Tunnel URL, e.g.
//   https://pitch-api.yourdomain.com/api
// In local dev: Vite proxies /api → localhost:8000 so this falls back to '/api'
const BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api'
const ORIGIN = BASE.replace(/\/api$/, '')

async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${ORIGIN}/health`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}

export async function createSession(playerName: string): Promise<SessionState | null> {
  try {
    const res = await fetch(`${BASE}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_name: playerName }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getSession(sessionId: string): Promise<SessionState | null> {
  try {
    const res = await fetch(`${BASE}/sessions/${sessionId}`, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function submitPitch(
  sessionId: string,
  cards: Card[],
  transcript?: string,
): Promise<InvestorResponse | null> {
  try {
    const res = await fetch(`${BASE}/sessions/${sessionId}/pitch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cards, transcript }),
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function advanceRound(sessionId: string): Promise<{ game_over: boolean; state: SessionState | null }> {
  try {
    const res = await fetch(`${BASE}/sessions/${sessionId}/advance`, {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return { game_over: false, state: null }
    return res.json()
  } catch {
    return { game_over: false, state: null }
  }
}

export async function analyzeSpeech(transcript: string, investorPref?: string): Promise<{ ethos: number; pathos: number; logos: number; summary: string } | null> {
  try {
    const res = await fetch(`${BASE}/speech/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, investor_pref: investorPref }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export { isBackendAvailable }
