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

  return (
    <div className="screen-end">
      <div className="end-eyebrow">{playerName} · {wins}/5 Investors Funded You</div>
      <div className={`end-title ${won ? 'win' : 'loss'}`}>{won ? 'FUNDED' : 'PASSED'}</div>
      <div className="end-sub">{subtitle}</div>

      <div className="end-breakdown">
        {results.map((r, i) => {
          const cardTypes = r.cards_played?.map(c => c.type) ?? []
          const prefMatch = r.investor_pref
            ? cardTypes.some(t => r.investor_pref.toLowerCase().includes(t))
            : null

          return (
            <div key={i} className={`end-round ${r.won ? 'won' : 'lost'}`}>
              <div className="end-round-header">
                <span className="end-round-num">Round {i + 1}</span>
                <span className="end-round-who">
                  {r.investor_emoji} {r.investor_name.replace('The ', '')}
                </span>
                <span className={`end-verdict ${r.won ? 'funded' : 'passed'}`}>
                  {r.won ? '✓ Funded' : '✗ Passed'}
                </span>
              </div>

              {r.cards_played && r.cards_played.length > 0 && (
                <div className="end-round-detail">
                  <div className="end-round-cards">
                    {r.cards_played.map((c, ci) => (
                      <span key={ci} className={`mini-card ${c.type}`}>{c.text}</span>
                    ))}
                  </div>
                  <div className="end-round-meta">
                    <span className="end-round-startup">{r.startup_name}</span>
                    {r.investor_pref && (
                      <span className={`end-round-pref ${prefMatch ? 'match' : 'miss'}`}>
                        {prefMatch ? '↑ played to their strength' : `↓ investor wanted ${r.investor_pref}`}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
        Final rep score: <strong style={{ color: 'var(--accent)' }}>{repScore}</strong>
      </div>

      <div className="end-lesson">
        {won
          ? 'You read the room and adapted. The card types you chose aligned with what each investor values — that\'s the skill.'
          : 'Look at the rounds you lost: where the investor wanted one thing and you played another. That gap is the lesson.'}
      </div>

      <div className="end-actions">
        <button className="btn-primary" style={{ width: 'auto' }} onClick={resetGame}>
          Play Again
        </button>
      </div>
    </div>
  )
}
