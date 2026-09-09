import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * Styled listbox used for every dropdown in the app.
 * `options` accepts plain strings or { id, label } objects.
 */
export default function Select({
  options,
  value,
  onChange,
  className = '',
  buttonClassName = '',
  placeholder = 'Select',
  align = 'left',
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const normalized = options.map((o) => (typeof o === 'string' ? { id: o, label: o } : o))
  const selected = normalized.find((o) => o.id === value)

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex h-[38px] w-full items-center justify-between gap-2 rounded-[9px] border bg-white pl-[14px] pr-[11px] text-left text-[13px] font-medium text-ink outline-none transition-colors ${
          open ? 'border-brand' : 'border-line'
        } ${buttonClassName}`}
      >
        <span className={`truncate whitespace-nowrap ${selected ? '' : 'text-ink-muted'}`}>{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={17}
          className={`shrink-0 text-[#5B6B7F] transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`scroll-thin absolute z-40 mt-[6px] max-h-[248px] w-full min-w-[180px] overflow-y-auto rounded-[10px] border border-line bg-white py-[5px] shadow-pop ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
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
        </ul>
      )}
    </div>
  )
}
