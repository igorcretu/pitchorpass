import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useTimer } from '../../hooks/useTimer'
import { useSpeech } from '../../hooks/useSpeech'
import { useWaveform } from '../../hooks/useWaveform'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { transcribeAudio } from '../../api/client'
import type { SpeechMetrics } from '../../types'

const PITCH_TIME = 90
const CIRCUMFERENCE = 2 * Math.PI * 50
const MIN_WORDS = 8

type Phase = 'requesting' | 'recording' | 'analyzing' | 'too-short' | 'denied'

// Derive basic metrics from browser transcript when Whisper isn't available
function localMetrics(text: string, durationSeconds: number): SpeechMetrics {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const wpm = durationSeconds > 0 ? Math.round((words.length / durationSeconds) * 60) : 0
  const fillers = ['um', 'uh', 'like', 'you know', 'basically', 'kind of', 'sort of']
  const filler_words = fillers.reduce((n, f) => n + (text.toLowerCase().split(f).length - 1), 0)
  return { word_count: words.length, duration_seconds: Math.round(durationSeconds), wpm, filler_words, long_pauses: 0 }
}

export function SpeechOverlay() {
  const { speechOverlayOpen, currentInvestor, closeSpeechOverlay, submitPitch, backendOnline } = useGameStore()
  const { transcript, supported, start: startSpeech, stop: stopSpeech, reset: resetSpeech } = useSpeech()
  const { start: startRecorder, stop: stopRecorder, reset: resetRecorder } = useAudioRecorder()
  const [phase, setPhase] = useState<Phase>('requesting')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [analysisMsg, setAnalysisMsg] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const startedAtRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useWaveform(stream, canvasRef)

  const handleExpire = () => stopAndSubmit()

  const { remaining, progress, start: startTimer, stop: stopTimer } = useTimer(PITCH_TIME, handleExpire)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setStream(null)
  }

  const beginRecording = (s: MediaStream) => {
    setStream(s)
    streamRef.current = s
    setPhase('recording')
    startedAtRef.current = Date.now()
    startTimer()
    if (supported) startSpeech()
    startRecorder(s)
  }

  useEffect(() => {
    if (!speechOverlayOpen) {
      stopTimer()
      stopSpeech()
      stopStream()
      resetSpeech()
      resetRecorder()
      setPhase('requesting')
      return
    }

    resetSpeech()
    resetRecorder()

    if (!supported) {
      setPhase('recording')
      startedAtRef.current = Date.now()
      startTimer()
      return
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(beginRecording)
      .catch(() => setPhase('denied'))
  }, [speechOverlayOpen])

  const stopAndSubmit = async () => {
    stopTimer()
    stopSpeech()

    const elapsed = (Date.now() - startedAtRef.current) / 1000
    setPhase('analyzing')

    const audioBlob = await stopRecorder()
    const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length

    if (wordCount < MIN_WORDS) {
      stopStream()
      setPhase('too-short')
      return
    }

    let finalTranscript = transcript
    let metrics: SpeechMetrics | undefined

    if (backendOnline && audioBlob.size > 1000) {
      setAnalysisMsg('Transcribing with Whisper…')
      const result = await transcribeAudio(audioBlob)
      if (result && result.transcript.trim().split(/\s+/).length >= MIN_WORDS) {
        finalTranscript = result.transcript
        metrics = result.metrics
      }
    }

    if (!metrics) {
      metrics = localMetrics(finalTranscript, elapsed)
    }

    stopStream()
    submitPitch(finalTranscript, metrics)
  }

  const handleCancel = () => {
    stopTimer()
    stopSpeech()
    stopStream()
    resetSpeech()
    resetRecorder()
    closeSpeechOverlay()
  }

  const handleRetry = () => {
    resetSpeech()
    resetRecorder()
    setPhase('requesting')
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(beginRecording)
      .catch(() => setPhase('denied'))
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
              <p className="mic-sub">Grant mic access in your browser settings, then try again.</p>
              <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={handleCancel}>Cancel</button>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="mic-permission">
              <div className="mic-icon" style={{ fontSize: '1.5rem' }}>⏳</div>
              <p>{analysisMsg || 'Analyzing your pitch…'}</p>
              <p className="mic-sub">Computing delivery metrics from your audio.</p>
            </div>
          )}

          {phase === 'too-short' && (
            <div className="mic-permission">
              <div className="mic-icon">⚠️</div>
              <p>Pitch too short.</p>
              <p className="mic-sub">We didn't detect enough speech. Speak for at least 5–10 seconds.</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleRetry}>
                Re-record →
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
                <button className="btn-primary" onClick={stopAndSubmit}>Done — Submit Pitch →</button>
                <button className="btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
