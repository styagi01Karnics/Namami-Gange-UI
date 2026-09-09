import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cameraIcon from '../assets/camera-floating-sidebar.svg'

const WIDTH = 84
const HEIGHT = 148
const MARGIN = 24
const STORAGE_KEY = 'ng-floating-camera-pos'
const DRAG_THRESHOLD = 6

function clamp(pos) {
  return {
    x: Math.min(Math.max(0, pos.x), Math.max(0, window.innerWidth - WIDTH)),
    y: Math.min(Math.max(0, pos.y), Math.max(0, window.innerHeight - HEIGHT)),
  }
}

function defaultPos() {
  return clamp({
    x: window.innerWidth - WIDTH - MARGIN,
    y: window.innerHeight - HEIGHT - MARGIN,
  })
}

function loadPos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPos()
    const parsed = JSON.parse(raw)
    if (typeof parsed?.x !== 'number' || typeof parsed?.y !== 'number') return defaultPos()
    return clamp(parsed)
  } catch {
    return defaultPos()
  }
}

export default function FloatingCameraButton() {
  const navigate = useNavigate()
  const [pos, setPos] = useState(loadPos)
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)

  useEffect(() => {
    const onResize = () => setPos((current) => clamp(current))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const endDrag = (event, { openIfClick }) => {
    const session = drag.current
    if (!session || session.pointerId !== event.pointerId) return
    drag.current = null
    setDragging(false)
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch {
      // pointer already released
    }

    if (session.moved) {
      setPos((current) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
        return current
      })
      return
    }

    if (openIfClick) navigate('/cctv-monitoring')
  }

  return (
    <button
      type="button"
      aria-label="Open CCTV Monitoring"
      onPointerDown={(event) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
        drag.current = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          origX: pos.x,
          origY: pos.y,
          moved: false,
        }
      }}
      onPointerMove={(event) => {
        const session = drag.current
        if (!session || session.pointerId !== event.pointerId) return
        const dx = event.clientX - session.startX
        const dy = event.clientY - session.startY
        if (!session.moved && dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return
        session.moved = true
        setPos(clamp({ x: session.origX + dx, y: session.origY + dy }))
      }}
      onPointerUp={(event) => endDrag(event, { openIfClick: true })}
      onPointerCancel={(event) => endDrag(event, { openIfClick: false })}
      className={`fixed z-30 touch-none select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ left: pos.x, top: pos.y }}
    >
      <img
        src={cameraIcon}
        alt=""
        width={WIDTH}
        height={HEIGHT}
        draggable={false}
        className="pointer-events-none h-[148px] w-[84px] select-none"
      />
    </button>
  )
}
