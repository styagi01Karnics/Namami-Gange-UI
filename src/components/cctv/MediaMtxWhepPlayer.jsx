import { useEffect, useRef, useState } from 'react'
import {
  Camera,
  ExternalLink,
  Maximize,
  Minimize,
  MoreVertical,
  Pause,
  PictureInPicture2,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react'

let readerPromise

function pageUrl(src) {
  return src.endsWith('/') ? src : `${src}/`
}

function formatElapsed(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0))
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function formatLiveClock(date) {
  return date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function loadOfficialReader(page) {
  if (window.MediaMTXWebRTCReader) {
    return Promise.resolve(window.MediaMTXWebRTCReader)
  }
  if (readerPromise) return readerPromise

  readerPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = new URL('reader.js', page).toString()
    script.async = true
    script.onload = () => {
      if (window.MediaMTXWebRTCReader) resolve(window.MediaMTXWebRTCReader)
      else reject(new Error('Unable to load camera player'))
    }
    script.onerror = () => {
      readerPromise = null
      reject(new Error('Unable to load camera player'))
    }
    document.head.appendChild(script)
  })

  return readerPromise
}

function ControlButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/95 transition-colors hover:bg-white/15"
    >
      {children}
    </button>
  )
}

export default function MediaMtxWhepPlayer({ src, title }) {
  const videoRef = useRef(null)
  const frameRef = useRef(null)
  const [error, setError] = useState('')
  const [hovered, setHovered] = useState(false)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const [elapsed, setElapsed] = useState(0)
  const [liveClock, setLiveClock] = useState(() => formatLiveClock(new Date()))
  const [fullscreen, setFullscreen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const page = pageUrl(src)
  const showControls = hovered || menuOpen || paused

  useEffect(() => {
    let reader
    let cancelled = false
    const whepUrl = new URL('whep', page).toString()

    setError('')

    loadOfficialReader(page)
      .then((Reader) => {
        if (cancelled) return

        reader = new Reader({
          url: whepUrl,
          onError: (err) => {
            if (cancelled) return
            setError(String(err).replace(/^Error:\s*/i, ''))
          },
          onTrack: (event) => {
            if (cancelled) return
            setError('')
            const video = videoRef.current
            if (!video || !event.streams[0]) return
            video.srcObject = event.streams[0]
            video.muted = true
            video.play().then(() => setPaused(false)).catch(() => {})
          },
        })

        if (cancelled) {
          reader.close()
          reader = null
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to start camera')
      })

    return () => {
      cancelled = true
      reader?.close()
    }
  }, [page])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const onTime = () => setElapsed(video.currentTime || 0)
    const onPlay = () => setPaused(false)
    const onPause = () => setPaused(true)
    const onVolume = () => setMuted(video.muted || video.volume === 0)

    video.addEventListener('timeupdate', onTime)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('volumechange', onVolume)

    return () => {
      video.removeEventListener('timeupdate', onTime)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('volumechange', onVolume)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setLiveClock(formatLiveClock(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const onFull = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFull)
    return () => document.removeEventListener('fullscreenchange', onFull)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const close = () => setMenuOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [menuOpen])

  async function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) await video.play().catch(() => {})
    else video.pause()
  }

  function toggleMute() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    if (!video.muted && video.volume === 0) video.volume = 1
  }

  async function toggleFullscreen() {
    const frame = frameRef.current
    if (!frame) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await frame.requestFullscreen().catch(() => {})
  }

  async function togglePip() {
    const video = videoRef.current
    if (!video) return
    setMenuOpen(false)
    if (document.pictureInPictureElement) await document.exitPictureInPicture()
    else await video.requestPictureInPicture().catch(() => {})
  }

  function takeSnapshot() {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    setMenuOpen(false)
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${title || 'camera'}-snapshot.png`
    link.click()
  }

  function openInNewTab() {
    setMenuOpen(false)
    window.open(page, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      ref={frameRef}
      className="absolute inset-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setMenuOpen(false)
      }}
    >
      <video
        ref={videoRef}
        title={title}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 h-full w-full bg-[#07121e] object-cover"
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1a2430] px-4 text-center">
          <p className="text-[12px] font-medium text-[#e8edf4]">{error}</p>
        </div>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2 pb-2 pt-8 transition-opacity duration-150 ${
          showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="relative flex items-center gap-1 text-white">
          <ControlButton label={paused ? 'Play' : 'Pause'} onClick={togglePlay}>
            {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
          </ControlButton>
          <span className="min-w-[2.25rem] px-1 text-[12px] font-medium tabular-nums">{formatElapsed(elapsed)}</span>

          <span className="pointer-events-none absolute left-1/2 inline-flex -translate-x-1/2 items-center gap-[5px] text-[11px] font-medium">
            <span className="h-[5px] w-[5px] rounded-full bg-danger" />
            {liveClock}
          </span>

          <span className="ml-auto" />
          <ControlButton label={muted ? 'Unmute' : 'Mute'} onClick={toggleMute}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </ControlButton>
          <ControlButton label={fullscreen ? 'Exit full screen' : 'Full screen'} onClick={toggleFullscreen}>
            {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </ControlButton>
          <div className="relative">
            <ControlButton
              label="More options"
              onClick={(event) => {
                event.stopPropagation()
                setMenuOpen((open) => !open)
              }}
            >
              <MoreVertical size={16} />
            </ControlButton>
            {menuOpen && (
              <div
                className="absolute bottom-10 right-0 z-10 min-w-[168px] overflow-hidden rounded-lg border border-white/10 bg-[#111827] py-1 shadow-lg"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={togglePip}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-white hover:bg-white/10"
                >
                  <PictureInPicture2 size={14} />
                  Picture in picture
                </button>
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-white hover:bg-white/10"
                >
                  <Camera size={14} />
                  Snapshot
                </button>
                <button
                  type="button"
                  onClick={openInNewTab}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-white hover:bg-white/10"
                >
                  <ExternalLink size={14} />
                  Open in new tab
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
