import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CctvIcon from '../ui/CctvIcon'

const STORAGE_KEY = 'cctv-float-top'
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/** Draggable shortcut to the Live Camera Feed page — hidden on that page itself. */
export default function FloatingCctvButton() {
  const [top, setTop] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? Number(saved) : 140
  })
  const drag = useRef({ active: false, startY: 0, startTop: 0 })

  useEffect(() => {
    const onResize = () => setTop((prev) => clamp(prev, 72, window.innerHeight - 175))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onGripDown = (e) => {
    drag.current = { active: true, startY: e.clientY, startTop: top }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onGripMove = (e) => {
    if (!drag.current.active) return
    const delta = e.clientY - drag.current.startY
    setTop(clamp(drag.current.startTop + delta, 72, window.innerHeight - 175))
  }

  const onGripUp = (e) => {
    if (!drag.current.active) return
    drag.current.active = false
    setTop((current) => {
      sessionStorage.setItem(STORAGE_KEY, String(current))
      return current
    })
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  return (
    <div
      style={{ top: `${top}px` }}
      className="fixed right-[12px] z-[45] flex w-[72px] flex-col items-center rounded-[16px] border border-[#8BB8E8] bg-[#CBE3F9] px-[10px] py-[14px] shadow-card"
    >
      <button
        type="button"
        aria-label="Drag camera feed shortcut"
        onPointerDown={onGripDown}
        onPointerMove={onGripMove}
        onPointerUp={onGripUp}
        className="flex h-[32px] w-full cursor-grab touch-none items-center justify-center text-[#7B8FA3] active:cursor-grabbing"
      >
        <span className="grid grid-cols-2 gap-[5px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="h-[4px] w-[4px] rounded-full bg-current" />
          ))}
        </span>
      </button>

      <Link
        to="/cctv-monitoring"
        aria-label="Open Live Camera Feed"
        className="mb-[20px] mt-[20px] flex w-full items-center justify-center transition-opacity hover:opacity-90"
      >
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[13px] bg-navy">
          <CctvIcon size={27} className="text-white" />
        </span>
      </Link>
    </div>
  )
}
