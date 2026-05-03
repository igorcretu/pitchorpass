import { useRef, useCallback } from 'react'

export function useAudioRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const start = useCallback((stream: MediaStream) => {
    chunksRef.current = []
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : ''
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.start(100)
    recorderRef.current = recorder
  }, [])

  const stop = useCallback((): Promise<Blob> => {
    return new Promise(resolve => {
      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve(new Blob(chunksRef.current, { type: 'audio/webm' }))
        return
      }
      recorder.onstop = () => resolve(new Blob(chunksRef.current, { type: recorder.mimeType }))
      recorder.stop()
    })
  }, [])

  const reset = useCallback(() => {
    recorderRef.current = null
    chunksRef.current = []
  }, [])

  return { start, stop, reset }
}
