import { useGameStore } from '../../store/gameStore'

export function TopBar() {
  const { currentRound, repScore, results, backendOnline, resetGame } = useGameStore()

  return (
    <div className="game-topbar">
      <span className="topbar-logo" onClick={resetGame}>P/P</span>
      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>
        Round <span>{currentRound + 1}</span> of 5
      </div>
      <div className="round-indicators">
        {Array.from({ length: 5 }, (_, i) => {
          let cls = 'round-dot'
          if (i < results.length) cls += results[i].won ? ' won' : ' lost'
          else if (i === currentRound) cls += ' current'
          return <div key={i} className={cls}>{i + 1}</div>
        })}
      </div>
      <div className="rep-score">Rep: <strong>{repScore}</strong></div>
      <div className={`backend-pill ${backendOnline ? 'online' : 'offline'}`}>
        <div className="backend-pill-dot" />
        {backendOnline ? 'AI' : 'Demo'}
      </div>
    </div>
  )
}
