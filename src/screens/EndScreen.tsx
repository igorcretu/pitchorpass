import { useGameStore } from '../store/gameStore'

export function EndScreen() {
  const { playerName, results, repScore, resetGame } = useGameStore()
  const wins = results.filter(r => r.won).length
  const won = wins >= 3

  const subtitle = won
    ? wins === 5
      ? 'A perfect pitch. Every investor said yes.'
      : `${wins} of 5 believed in you. That's enough. Series A, here we come.`
    : `Only ${wins} investor${wins === 1 ? '' : 's'} said yes. Study the patterns — the room always tells you what it wants.`

  const lesson = won
    ? 'What made the difference: you read the room and adapted. The investors who said no were the ones where you fell back on a single strategy. Flexibility is the skill.'
    : 'Failure is a learning tool, not a verdict. Look at which investors passed and which cards you played. What was the mismatch? Identify the gap, not the feeling.'

  return (
    <div className="screen-end">
      <div className="end-eyebrow">{playerName} · {wins}/5 Investors Funded You</div>
      <div className={`end-title ${won ? 'win' : 'loss'}`}>{won ? 'FUNDED' : 'PASSED'}</div>
      <div className="end-sub">{subtitle}</div>

      <div className="end-breakdown">
        {results.map((r, i) => (
          <div key={i} className={`end-round ${r.won ? 'won' : 'lost'}`}>
            <div className="end-round-num">Round {i + 1}</div>
            <div className="end-round-emoji">{r.investor_emoji}</div>
            <div className="end-round-name">{r.investor_name.replace('The ', '')}</div>
            <div className="end-verdict">{r.won ? '✓' : '✗'}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
        Final rep score: <strong style={{ color: 'var(--accent)' }}>{repScore}</strong>
      </div>

      <div className="end-lesson">{lesson}</div>

      <div className="end-actions">
        <button className="btn-primary" style={{ width: 'auto' }} onClick={resetGame}>
          Play Again
        </button>
      </div>
    </div>
  )
}
