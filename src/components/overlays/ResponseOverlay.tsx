import { useEffect, useRef } from 'react'
import { useGameStore } from '../../store/gameStore'

export function ResponseOverlay() {
  const { responseOverlayOpen, investorResponse, isSubmitting, currentInvestor, currentRound, advance } = useGameStore()
  const ethosRef = useRef<HTMLDivElement>(null)
  const pathosRef = useRef<HTMLDivElement>(null)
  const logosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!investorResponse) return
    const t = setTimeout(() => {
      if (ethosRef.current) ethosRef.current.style.width = `${investorResponse.ethos}%`
      if (pathosRef.current) pathosRef.current.style.width = `${investorResponse.pathos}%`
      if (logosRef.current) logosRef.current.style.width = `${investorResponse.logos}%`
    }, 80)
    return () => clearTimeout(t)
  }, [investorResponse])

  // Reset bars when overlay opens fresh
  useEffect(() => {
    if (responseOverlayOpen && !investorResponse) {
      if (ethosRef.current) ethosRef.current.style.width = '0%'
      if (pathosRef.current) pathosRef.current.style.width = '0%'
      if (logosRef.current) logosRef.current.style.width = '0%'
    }
  }, [responseOverlayOpen, investorResponse])

  if (!responseOverlayOpen) return null

  return (
    <div className="overlay active">
      <div className="response-box">
        <div className="response-header">
          <div className={`status-dot${isSubmitting ? ' thinking' : ''}`} />
          <span className="response-status">
            {isSubmitting ? 'Investor is reading your pitch…' : 'Investor has responded.'}
          </span>
          <div className="response-investor">
            {currentInvestor?.emoji} {currentInvestor?.name}
          </div>
        </div>
        <div className="response-body">
          <div className="response-quote">
            {isSubmitting
              ? <span className="thinking-dots"><span>•</span><span>•</span><span>•</span></span>
              : investorResponse
                ? `"${investorResponse.reaction}"`
                : null
            }
          </div>

          {investorResponse && (
            <>
              <div className="score-bars">
                {(['ethos', 'pathos', 'logos'] as const).map(type => (
                  <div key={type} className={`bar-row ${type}`}>
                    <div className={`bar-label ${type}`}>{type}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        ref={type === 'ethos' ? ethosRef : type === 'pathos' ? pathosRef : logosRef}
                      />
                    </div>
                    <div className="bar-pct">
                      {type === 'ethos' ? investorResponse.ethos : type === 'pathos' ? investorResponse.pathos : investorResponse.logos}%
                    </div>
                  </div>
                ))}
              </div>

              <div className={`verdict ${investorResponse.funded ? 'funded' : 'rejected'}`}>
                {investorResponse.funded ? '✓ Funded — They\'re in.' : '✗ Rejected — Not this time.'}
              </div>

              <div className="objection-box">
                <div className="objection-label">Objection — keep this in mind</div>
                <div className="objection-text">{investorResponse.objection}</div>
              </div>

              <div className="response-actions">
                <button className="btn-primary" onClick={advance}>
                  {currentRound >= 4 ? 'See Results →' : 'Next Investor →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
