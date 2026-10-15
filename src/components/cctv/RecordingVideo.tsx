import { useEffect, useRef, type VideoHTMLAttributes } from 'react'

/**
 * Plays a converted CPV clip while cropping the NVR OSD timestamp
 * burned into the top of the frame (e.g. "01-10-2026 00:58:00").
 */
export default function RecordingVideo({
  className = '',
  src,
  ...props
}: VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    // Ensure muted is set programmatically so browsers permit autoplay
    el.muted = true
    el.defaultMuted = true
    const playPromise = el.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Playback can resume on canplay or user interaction
      })
    }
  }, [src])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07121e]">
      <video
        ref={videoRef}
        src={src}
        {...props}
        autoPlay
        muted
        playsInline
        onCanPlay={(e) => {
          props.onCanPlay?.(e)
          e.currentTarget.play().catch(() => {})
        }}
        onPause={(e) => {
          props.onPause?.(e)
          // Automatically resume if browser paused the feed unexpectedly
          e.currentTarget.play().catch(() => {})
        }}
        className={`absolute inset-x-0 bottom-0 h-[112%] w-full bg-[#07121e] object-cover ${className}`}
      />
    </div>
  )
}

