import { create } from 'zustand'
import type { Card, InvestorData, InvestorResponse, RoundResult, Screen, SessionState, SpeechMetrics, StartupData } from '../types'
import { INVESTORS, shuffleDraw, pickStartup, localEvaluate } from '../data/gameData'
import * as api from '../api/client'
import { saveGame } from '../lib/history'

interface GameStore {
  // Meta
  screen: Screen
  playerName: string
  backendOnline: boolean
  sessionId: string | null

  // Progress
  currentRound: number
  repScore: number
  results: RoundResult[]

  // Current round
  currentInvestor: InvestorData | null
  currentStartup: StartupData | null
  currentHand: Card[]
  selectedCards: (number | null)[]
  usedStartups: string[]

  // Overlay state
  speechOverlayOpen: boolean
  responseOverlayOpen: boolean
  investorResponse: InvestorResponse | null
  isSubmitting: boolean

  // Actions
  goToSetup: () => void
  setPlayerName: (name: string) => void
  startGame: () => Promise<void>
  resetGame: () => void
  pickCard: (idx: number) => void
  removeCard: (slot: number) => void
  clearSelection: () => void
  openSpeechOverlay: () => void
  closeSpeechOverlay: () => void
  submitPitch: (transcript?: string, metrics?: SpeechMetrics) => Promise<void>
  advance: () => Promise<void>
}

function makeLocalSession(playerName: string): Partial<GameStore> {
  const startup = pickStartup([])
  return {
    sessionId: null,
    playerName,
    currentRound: 0,
    repScore: 100,
    results: [],
    currentInvestor: INVESTORS[0],
    currentStartup: startup,
    currentHand: shuffleDraw(),
    selectedCards: [null, null, null],
    usedStartups: [startup.name],
  }
}

function applySessionState(state: SessionState): Partial<GameStore> {
  return {
    sessionId: state.session_id,
    playerName: state.player_name,
    currentRound: state.current_round,
    repScore: state.rep_score,
    results: state.results,
    currentInvestor: state.current_investor,
    currentStartup: state.current_startup,
    currentHand: state.current_hand,
    selectedCards: [null, null, null],
    usedStartups: state.used_startups,
  }
}

// Key used to update the same game record across rounds
let activeGameId: string | null = null

function persistGame(playerName: string, results: RoundResult[], repScore: number) {
  if (!activeGameId) activeGameId = crypto.randomUUID()
  saveGame({
    id: activeGameId,
    date: new Date().toISOString(),
    playerName,
    wins: results.filter(r => r.won).length,
    finalRepScore: repScore,
    rounds: results,
  })
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'landing',
  playerName: '',
  backendOnline: false,
  sessionId: null,
  currentRound: 0,
  repScore: 100,
  results: [],
  currentInvestor: null,
  currentStartup: null,
  currentHand: [],
  selectedCards: [null, null, null],
  usedStartups: [],
  speechOverlayOpen: false,
  responseOverlayOpen: false,
  investorResponse: null,
  isSubmitting: false,

  goToSetup: () => set({ screen: 'setup' }),

  setPlayerName: (name) => set({ playerName: name }),

  startGame: async () => {
    activeGameId = null
    const { playerName } = get()
    const name = playerName.trim() || 'Founder'

    const online = await api.isBackendAvailable()
    set({ backendOnline: online })

    if (online) {
      const session = await api.createSession(name)
      if (session) {
        set({ ...applySessionState(session), screen: 'game' })
        return
      }
    }

    set({ ...makeLocalSession(name), screen: 'game' })
  },

  resetGame: () => set({
    screen: 'landing',
    sessionId: null,
    currentRound: 0,
    repScore: 100,
    results: [],
    currentInvestor: null,
    currentStartup: null,
    currentHand: [],
    selectedCards: [null, null, null],
    usedStartups: [],
    investorResponse: null,
    speechOverlayOpen: false,
    responseOverlayOpen: false,
  }),

  pickCard: (idx) => {
    const { selectedCards } = get()
    if (selectedCards.includes(idx)) return
    const slot = selectedCards.findIndex(s => s === null)
    if (slot === -1) return
    const next = [...selectedCards]
    next[slot] = idx
    set({ selectedCards: next })
  },

  removeCard: (slot) => {
    const next = [...get().selectedCards]
    next[slot] = null
    set({ selectedCards: next })
  },

  clearSelection: () => set({ selectedCards: [null, null, null] }),

  openSpeechOverlay: () => set({ speechOverlayOpen: true }),
  closeSpeechOverlay: () => set({ speechOverlayOpen: false }),

  submitPitch: async (transcript, metrics) => {
    const { sessionId, selectedCards, currentHand, currentInvestor, repScore, backendOnline } = get()
    const cards = selectedCards.map(i => currentHand[i as number])

    set({ isSubmitting: true, speechOverlayOpen: false, responseOverlayOpen: true, investorResponse: null })

    let response: InvestorResponse | null = null

    if (backendOnline && sessionId) {
      response = await api.submitPitch(sessionId, cards, transcript, metrics)
    }

    if (!response) {
      await new Promise(r => setTimeout(r, 1400 + Math.random() * 800))
      const inv = INVESTORS.find(i => i.name === currentInvestor!.name)!
      response = localEvaluate(inv, cards, repScore)
    }

    const won = response.funded
    const newRep = won ? Math.min(100, repScore + 5) : Math.max(20, repScore - 12)
    const newResult: RoundResult = {
      won,
      investor_name: currentInvestor!.name,
      investor_emoji: currentInvestor!.emoji,
      startup_name: get().currentStartup!.name,
      round_num: get().currentRound,
      cards_played: cards,
      investor_pref: currentInvestor!.pref_label,
      transcript,
      ai_response: response,
    }

    if (backendOnline && sessionId) {
      const updated = await api.getSession(sessionId)
      if (updated) {
        set({ repScore: updated.rep_score })
      } else {
        set({ repScore: newRep })
      }
    } else {
      set({ repScore: newRep })
    }

    const updatedResults = [...get().results, newResult]
    set({ results: updatedResults, investorResponse: response, isSubmitting: false })
    persistGame(get().playerName, updatedResults, get().repScore)
  },

  advance: async () => {
    const { sessionId, currentRound, backendOnline, usedStartups, repScore, playerName, results } = get()

    if (currentRound >= 4) {
      activeGameId = null // reset so next game gets a fresh id
      set({ responseOverlayOpen: false, screen: 'end' })
      return
    }

    const nextRound = currentRound + 1

    if (backendOnline && sessionId) {
      const result = await api.advanceRound(sessionId)
      if (result.game_over) {
        activeGameId = null
        set({ responseOverlayOpen: false, screen: 'end' })
        return
      }
      if (result.state) {
        set({ ...applySessionState(result.state), responseOverlayOpen: false })
        return
      }
    }

    // local fallback
    const investor = INVESTORS[nextRound]
    const startup = pickStartup(usedStartups)
    set({
      currentRound: nextRound,
      currentInvestor: investor,
      currentStartup: startup,
      currentHand: shuffleDraw(),
      selectedCards: [null, null, null],
      usedStartups: [...usedStartups, startup.name],
      responseOverlayOpen: false,
    })
  },
}))
