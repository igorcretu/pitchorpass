import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTimer } from '../../hooks/useTimer'
import { useSpeech } from '../../hooks/useSpeech'
import { useWaveform } from '../../hooks/useWaveform'

const PITCH_TIME = 90
const CIRCUMFERENCE = 2 * Math.PI * 50

type Phase = 'requesting' | 'recording' | 'denied'

export function SpeechOverlay() {
  const { speechOverlayOpen, currentInvestor, closeSpeechOverlay, submitPitch } = useGameStore()
  const { transcript, supported, start, stop, reset } = useSpeech()
  const [phase, setPhase] = useState<Phase>('requesting')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useWaveform(stream, canvasRef)

  const handleExpire = () => {
    stop()
    submitPitch(transcript || undefined)
  }

  const { remaining, progress, start: startTimer, stop: stopTimer } = useTimer(PITCH_TIME, handleExpire)

  const beginRecording = (s: MediaStream) => {
    setStream(s)
    streamRef.current = s
    setPhase('recording')
    startTimer()
    if (supported) start()
  }

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStream(null)
  }

  useEffect(() => {
    if (!speechOverlayOpen) {
      stopTimer()
      stop()
      stopStream()
      setPhase('requesting')
      return
    }

    reset()

    if (!supported) {
      // No mic support — skip permission, start timer immediately
      setPhase('recording')
      startTimer()
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(beginRecording)
      .catch(() => setPhase('denied'))
  }, [speechOverlayOpen])

  const handleDone = () => {
    stopTimer()
    stop()
    stopStream()
    submitPitch(transcript || undefined)
  }

  const handleCancel = () => {
    stopTimer()
    stop()
    stopStream()
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

          {phase === 'requesting' && (
            <div className="mic-permission">
              <div className="mic-icon">🎤</div>
              <p>Waiting for microphone access…</p>
              <p className="mic-sub">Allow microphone access in your browser to start the timer.</p>
            </div>
          )}

          {phase === 'denied' && (
            <div className="mic-permission">
              <div className="mic-icon">🚫</div>
              <p>Microphone access denied.</p>
              <p className="mic-sub">Your speech won't be transcribed, but you can still submit your pitch.</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleDone}>
                Submit without transcript →
              </button>
              <button className="btn-secondary" style={{ marginTop: '0.5rem' }} onClick={handleCancel}>Cancel</button>
            </div>
          )}

          {phase === 'recording' && (
            <>
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
                <div className="mic-icon">🎙</div>
                <div className="mic-prompt">You're on — speak your pitch</div>
                {stream ? (
                  <canvas ref={canvasRef} className="waveform-canvas" width={360} height={60} />
                ) : (
                  <div className="waveform">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div key={i} className="waveform-bar" />
                    ))}
                  </div>
                )}
                {supported && transcript && (
                  <div className="transcript-box">
                    <div className="transcript-label">Live transcript</div>
                    <div className="transcript-text">{transcript}</div>
                  </div>
                )}
              </div>

              <div className="speech-actions">
                <button className="btn-primary" onClick={handleDone}>Done — Submit Pitch →</button>
                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
