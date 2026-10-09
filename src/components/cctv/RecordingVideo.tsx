import type { VideoHTMLAttributes } from 'react'

/**
 * Plays a converted CPV clip while cropping the NVR OSD timestamp
 * burned into the top of the frame (e.g. "01-10-2026 00:58:00").
 */
export default function RecordingVideo({
  className = '',
  ...props
}: VideoHTMLAttributes<HTMLVideoElement>) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#07121e]">
      <video
        {...props}
        className={`absolute inset-x-0 bottom-0 h-[112%] w-full bg-[#07121e] object-cover ${className}`}
      />
    </div>
  )
}
