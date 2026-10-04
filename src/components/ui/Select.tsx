import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import type { SelectOption } from '../../types'

type SelectProps = {
  options: SelectOption[]
  value?: string
  onChange?: (id: string) => void
  className?: string
  buttonClassName?: string
  placeholder?: string
  align?: 'left' | 'right'
  chevronSize?: number
  dropUp?: boolean
}

type MenuBox = {
  top?: number
  bottom?: number
  left: number
  width: number
  maxHeight: number
}

const MENU_GAP = 6
const MENU_PAD = 8

function measureMenu(button: HTMLElement, preferUp: boolean, align: 'left' | 'right'): MenuBox {
  const rect = button.getBoundingClientRect()
  const width = Math.max(rect.width, 180)
  const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - MENU_PAD
  const spaceAbove = rect.top - MENU_GAP - MENU_PAD
  const dropUp = preferUp || (spaceBelow < 160 && spaceAbove > spaceBelow)
  const left =
    align === 'right'
      ? Math.max(MENU_PAD, rect.right - width)
      : Math.min(rect.left, window.innerWidth - width - MENU_PAD)

  return {
    left: Math.max(MENU_PAD, left),
    width,
    maxHeight: Math.min(320, Math.max(dropUp ? spaceAbove : spaceBelow, 120)),
    top: dropUp ? undefined : rect.bottom + MENU_GAP,
    bottom: dropUp ? window.innerHeight - rect.top + MENU_GAP : undefined,
  }
}

export default function Select({
  options,
  value,
  onChange,
  className = '',
  buttonClassName = '',
  placeholder = 'Select',
  align = 'left',
  chevronSize = 17,
  dropUp = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [box, setBox] = useState<MenuBox | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLUListElement>(null)

  const normalized = options.map((o) => (typeof o === 'string' ? { id: o, label: o } : o))
  const selected = normalized.find((o) => o.id === value)

  useLayoutEffect(() => {
    if (!open) {
      setBox(null)
      return undefined
    }

    const update = () => {
      if (buttonRef.current) setBox(measureMenu(buttonRef.current, dropUp, align))
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [open, dropUp, align])

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const menu =
    open &&
    box &&
    createPortal(
      <ul
        ref={menuRef}
        role="listbox"
        style={{
          position: 'fixed',
          top: box.top,
          bottom: box.bottom,
          left: box.left,
          width: box.width,
          maxHeight: box.maxHeight,
          zIndex: 80,
        }}
        className="scroll-thin overflow-y-auto rounded-[10px] border border-line bg-white py-[5px] shadow-pop"
      >
        {normalized.map((o) => {
          const isSelected = o.id === value
          return (
            <li key={o.id}>
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange?.(o.id)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-2 px-[14px] py-[8px] text-left text-[13px] transition-colors ${
                  isSelected ? 'bg-brand-soft font-semibold text-brand' : 'text-ink hover:bg-[#F5F9FE]'
                }`}
              >
                <span>{o.label}</span>
                {isSelected && <Check size={15} strokeWidth={2.6} className="shrink-0" />}
              </button>
            </li>
          )
        })}
      </ul>,
      document.body,
    )

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-[38px] w-full items-center justify-between gap-2 rounded-[9px] border bg-white pl-[14px] pr-[11px] text-left text-[13px] font-medium text-ink outline-none transition-colors ${
          open ? 'border-brand' : 'border-line'
        } ${buttonClassName}`}
      >
        <span className={`truncate whitespace-nowrap ${selected ? '' : 'text-ink-muted'}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={chevronSize}
          className={`shrink-0 text-[#5B6B7F] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {menu}
    </div>
  )
}
