
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

const CAMERA_URL ='https://stp26mldrishi.tail72c450.ts.net/camera1/'

const RECORDING_DURATION = 60 * 60 * 1000 // 1 hour

export default function CameraRecorder() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [status, setStatus] = useState('Connecting camera...')
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playlistUrl = new URL('index.m3u8', CAMERA_URL).toString()

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls

      hls.loadSource(playlistUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
          .then(() => setStatus('Camera connected'))
          .catch(() => setStatus('Click play to start camera'))
      })

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setStatus('Camera stream error')
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = playlistUrl
      video.play()
        .then(() => setStatus('Camera connected'))
        .catch(() => setStatus('Click play to start camera'))
    } else {
      setStatus('HLS is not supported by this browser')
    }

    return () => {
      hlsRef.current?.destroy()
      hlsRef.current = null

      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function startRecording() {
    const video = videoRef.current

    if (!video || video.readyState < 2) {
      setStatus('Camera is not ready')
      return
    }

    if (!video.captureStream) {
      setStatus('Video recording is not supported in this browser')
      return
    }

    const stream = video.captureStream()

    const mimeType = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ].find(type => MediaRecorder.isTypeSupported(type))

    if (!mimeType) {
      setStatus('No supported recording format found')
      return
    }

    chunksRef.current = []

    const recorder = new MediaRecorder(stream, { mimeType })
    recorderRef.current = recorder

    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType,
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `26MLD_Rishikesh_${new Date()
        .toISOString()
        .replace(/[:.]/g, '-')}.webm`

      link.click()

      setTimeout(() => URL.revokeObjectURL(url), 60000)

      setStatus('Recording completed. File downloaded.')
      setRecording(false)
      setSeconds(0)
      chunksRef.current = []
    }

    recorder.onerror = () => {
      setStatus('Recording failed')
      setRecording(false)

      if (timerRef.current) clearTimeout(timerRef.current)
    }

    recorder.start(10000)

    setRecording(true)
    setSeconds(0)
    setStatus('Recording started')

    const startedAt = Date.now()

    const updateTimer = () => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000))
    }

    const interval = window.setInterval(() => {
      updateTimer()

      if (!recorderRef.current || recorderRef.current.state !== 'recording') {
        clearInterval(interval)
      }
    }, 1000)

    timerRef.current = setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop()
      }
      clearInterval(interval)
    }, RECORDING_DURATION)
  }

  function stopRecording() {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    }
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <h2 className="font-semibold">
        26 MLD Rishikesh - Camera Recording
      </h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls
        className="w-full rounded-lg bg-black"
      />

      <p>{status}</p>

      <p>
        Recording duration: {Math.floor(seconds / 60)}:
        {String(seconds % 60).padStart(2, '0')}
      </p>

      {!recording ? (
        <button
          type="button"
          onClick={startRecording}
          className="rounded-lg bg-green-600 px-4 py-2 text-white"
        >
          Start 1-Hour Recording
        </button>
      ) : (
        <button
          type="button"
          onClick={stopRecording}
          className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          Stop Recording
        </button>
      )}
    </div>
  )
}
