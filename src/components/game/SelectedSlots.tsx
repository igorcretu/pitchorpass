import { useGameStore } from '../../store/gameStore'

export function SelectedSlots() {
  const { selectedCards, currentHand, removeCard, clearSelection, openSpeechOverlay } = useGameStore()
  const allFilled = selectedCards.every(s => s !== null)

  return (
    <div className="selected-panel">
      <div className="panel-tag" style={{ marginBottom: '1rem' }}>Your Pitch — Pick 3 Cards</div>
      <div className="selected-slots">
        {selectedCards.map((idx, i) => {
          if (idx !== null) {
            const card = currentHand[idx]
            return (
              <div key={i} className={`slot filled ${card.type}`} onClick={() => removeCard(i)}>
                <div className="slot-type">{card.type}</div>
                <div className="slot-text">{card.text}</div>
              </div>
            )
          }
          return <div key={i} className="slot">Card {i + 1}</div>
        })}
      </div>
      <div className="pitch-action">
        <button className="btn-primary" disabled={!allFilled} onClick={openSpeechOverlay}>
          Deliver the Pitch 🎙 →
        </button>
        <button className="btn-secondary" onClick={clearSelection}>Clear</button>
      </div>
    </div>
  )
}
