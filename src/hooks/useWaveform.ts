import { useEffect, useRef } from 'react'

export function useWaveform(stream: MediaStream | null, canvasRef: React.RefObject<HTMLCanvasElement>) {
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!stream || !canvas) return

    const audioCtx = new AudioContext()
    const source = audioCtx.createMediaStreamSource(stream)
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 2048
    source.connect(analyser)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    const ctx2d = canvas.getContext('2d')!

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      analyser.getByteTimeDomainData(dataArray)

      const { width, height } = canvas
      ctx2d.clearRect(0, 0, width, height)
      ctx2d.beginPath()
      ctx2d.strokeStyle = '#f5c518'
      ctx2d.lineWidth = 1.5
      ctx2d.shadowColor = '#f5c51866'
      ctx2d.shadowBlur = 4

      const sliceWidth = width / bufferLength
      let x = 0
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = (v * height) / 2
        if (i === 0) ctx2d.moveTo(x, y)
        else ctx2d.lineTo(x, y)
        x += sliceWidth
      }
      ctx2d.lineTo(width, height / 2)
      ctx2d.stroke()
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      source.disconnect()
      audioCtx.close()
    }
  }, [stream])
}
