import { useGameStore } from '../../store/gameStore'

export function InvestorPanel() {
  const { currentInvestor } = useGameStore()
  if (!currentInvestor) return null

  return (
    <div className="investor-panel">
      <div className="panel-tag">Current Investor</div>
      <div className="investor-name">
        <span className="investor-emoji">{currentInvestor.emoji}</span>
        {currentInvestor.name}
      </div>
      <div className={`pref-badge ${currentInvestor.badge}`}>
        Favours: {currentInvestor.pref_label}
      </div>
      <div className="investor-hint">"{currentInvestor.hint}"</div>
    </div>
  )
}
