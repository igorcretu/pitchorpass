import type { RoundResult } from '../types'

export interface GameRecord {
  id: string
  date: string
  playerName: string
  wins: number
  finalRepScore: number
  rounds: RoundResult[]
}

const KEY = 'pop-history'
const MAX_RECORDS = 50

export function loadHistory(): GameRecord[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

export function saveGame(record: GameRecord): void {
  const history = loadHistory()
  const idx = history.findIndex(g => g.id === record.id)
  if (idx !== -1) {
    history[idx] = record
  } else {
    history.unshift(record)
    if (history.length > MAX_RECORDS) history.splice(MAX_RECORDS)
  }
  localStorage.setItem(KEY, JSON.stringify(history))
}

export function exportHistoryJSON(): void {
  const history = loadHistory()
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pitch-history-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportSessionJSON(record: GameRecord): void {
  const blob = new Blob([JSON.stringify(record, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pitch-session-${record.date.replace(/[:.]/g, '-')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
