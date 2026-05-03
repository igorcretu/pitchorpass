import { useGameStore } from '../store/gameStore'

export function SetupScreen() {
  const { playerName, setPlayerName, startGame } = useGameStore()

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') startGame()
  }

  return (
    <div className="screen-setup">
      <div className="setup-box" style={{ marginTop: '3rem' }}>
        <div className="setup-header">
          <div className="setup-logo">PITCH OR PASS</div>
          <span>Investor Simulation</span>
        </div>
        <div className="setup-body">
          <div className="field">
            <label>Your Name</label>
            <input
              type="text"
              placeholder="e.g. Alex"
              autoComplete="off"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={handleKey}
              autoFocus
            />
          </div>
          <button className="btn-primary" onClick={startGame}>
            Enter the Room →
          </button>
          <p className="setup-note">5 rounds · 5 investors · 3 wins to get funded</p>
        </div>
      </div>
    </div>
  )
}
