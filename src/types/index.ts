export type CardType = 'ethos' | 'pathos' | 'logos'
export type InvestorPref = 'ethos' | 'pathos' | 'logos' | 'mixed'
export type Screen = 'landing' | 'setup' | 'game' | 'end'

export interface Card {
  type: CardType
  text: string
}

export interface InvestorData {
  name: string
  emoji: string
  pref: InvestorPref
  pref_label: string
  badge: string
  hint: string
}

export interface StartupData {
  name: string
  desc: string
}

export interface RoundResult {
  won: boolean
  investor_name: string
  investor_emoji: string
  startup_name: string
  round_num: number
}

export interface SessionState {
  session_id: string
  player_name: string
  current_round: number
  rep_score: number
  results: RoundResult[]
  current_investor: InvestorData
  current_startup: StartupData
  current_hand: Card[]
  used_startups: string[]
}

export interface InvestorResponse {
  reaction: string
  ethos: number
  pathos: number
  logos: number
  funded: boolean
  objection: string
}
