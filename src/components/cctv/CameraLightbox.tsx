import { useEffect } from 'react'
import { X } from 'lucide-react'
import { CameraStill } from './CameraTile'

/** Full-screen view behind the expand button on a camera tile. */
export default function CameraLightbox({ camera, siteName, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-[32px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${siteName} — ${camera.location} camera`}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[900px] rounded-[14px] bg-white p-[15px] shadow-pop"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-semibold leading-5 text-ink">
              {camera.location} — {camera.id}
            </h3>
            <p className="mt-[4px] truncate text-[12.5px] leading-4 text-ink-muted">{siteName}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close camera view"
            className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border border-line text-ink-soft transition-colors hover:text-brand"
          >
            <X size={17} strokeWidth={2.2} />
          </button>
        </div>

        <div className="relative mt-[13px] aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-[#CBD9E5]">
          <CameraStill camera={camera} sceneId={`lightbox-${camera.key}`} />

          {camera.timecode && (
            <span className="absolute bottom-[12px] right-[12px] inline-flex items-center gap-[5px] rounded-full bg-white/90 px-[9px] py-[4px] text-[12px] font-medium leading-4 text-ink">
              <span className="h-[5px] w-[5px] rounded-full bg-danger" />
              {camera.timecode}
            </span>
          )}
        </div>

        <dl className="mt-[13px] grid grid-cols-3 gap-[14px]">
          {[
            ['Status', camera.status],
            ['Camera ID', camera.id],
            ['Last Active', camera.lastActive],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-[11.5px] font-medium leading-4 text-ink-muted">{label}</dt>
              <dd className="mt-[4px] text-[13px] font-semibold leading-[18px] text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
