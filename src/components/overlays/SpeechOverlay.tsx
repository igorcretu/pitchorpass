import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTimer } from '../../hooks/useTimer'
import { useSpeech } from '../../hooks/useSpeech'

const PITCH_TIME = 90
const CIRCUMFERENCE = 2 * Math.PI * 50 // r=50 → ~314

export function SpeechOverlay() {
  const { speechOverlayOpen, currentInvestor, closeSpeechOverlay, submitPitch } = useGameStore()
  const { transcript, listening, supported, start, stop, reset } = useSpeech()

  const handleExpire = () => {
    stop()
    submitPitch(transcript || undefined)
  }

  const { remaining, running, progress, start: startTimer, stop: stopTimer } = useTimer(PITCH_TIME, handleExpire)

  useEffect(() => {
    if (speechOverlayOpen) {
      reset()
      startTimer()
      if (supported) start()
    } else {
      stopTimer()
      stop()
    }
  }, [speechOverlayOpen])

  const handleDone = () => {
    stopTimer()
    stop()
    submitPitch(transcript || undefined)
  }

  const handleCancel = () => {
    stopTimer()
    stop()
    reset()
    closeSpeechOverlay()
  }

  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const urgent = remaining <= 15

  if (!speechOverlayOpen) return null

  return (
    <div className="overlay active">
      <div className="speech-box">
        <div className="speech-header">
          <div className="speech-title">Deliver Your Pitch</div>
          <div className="speech-investor-label">
            {currentInvestor?.emoji} {currentInvestor?.name}
          </div>
        </div>
        <div className="speech-body">
          <div className="timer-ring-wrap">
            <svg viewBox="0 0 110 110" width="130" height="130">
              <circle className="timer-ring-bg" cx="55" cy="55" r="50" />
              <circle
                className={`timer-ring-fill${urgent ? ' urgent' : ''}`}
                cx="55" cy="55" r="50"
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <div className="timer-center">
              <div className={`timer-seconds${urgent ? ' urgent' : ''}`}>{remaining}</div>
              <div className="timer-label">seconds</div>
            </div>
          </div>

          <div className="mic-area">
            <div className="mic-icon">{listening ? '🎙' : '🎤'}</div>
            <div className="mic-prompt">
              {listening ? "You're on — speak your pitch" : supported ? 'Microphone ready' : 'Speak your pitch'}
            </div>
            <div className="waveform">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={i} className="waveform-bar" style={{ opacity: listening ? undefined : 0.2 }} />
              ))}
            </div>
            {supported && transcript && (
              <div className="transcript-box" style={{ textAlign: 'left' }}>
                <div className="transcript-label">Live transcript</div>
                <div className="transcript-text">{transcript}</div>
              </div>
            )}
            {!supported && (
              <div className="mic-sub">
                In the final version, your speech will be captured and analysed in real time.
                Click <em>"Done — Submit Pitch"</em> when ready.
              </div>
            )}
          </div>

          <div className="speech-actions">
            <button className="btn-primary" onClick={handleDone}>Done — Submit Pitch →</button>
            <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
