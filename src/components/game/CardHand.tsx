import { useGameStore } from '../../store/gameStore'

export function CardHand() {
  const { currentHand, selectedCards, pickCard } = useGameStore()
  const selectedCount = selectedCards.filter(s => s !== null).length

  return (
    <div className="game-right">
      <div className="hand-header">
        <span className="hand-title">Your Hand</span>
        <span className="hand-count">{selectedCount}/3 selected</span>
      </div>
      <div className="hand-cards">
        {currentHand.map((card, i) => {
          const isSelected = selectedCards.includes(i)
          return (
            <div
              key={i}
              className={`card ${card.type}${isSelected ? ' selected' : ''}`}
              onClick={() => !isSelected && pickCard(i)}
            >
              <div className="card-type">{card.type}</div>
              <div className="card-text">{card.text}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
