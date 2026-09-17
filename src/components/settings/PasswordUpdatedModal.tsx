import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'

const CheckIcon = ico('fluent:checkmark-24-filled')

export default function PasswordUpdatedModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-updated-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] rounded-[16px] bg-white px-[28px] py-[32px] text-center shadow-pop"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[14px] top-[14px] text-ink-muted transition-colors hover:text-ink"
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <span className="mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-ok-soft">
          <span className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-ok text-white">
            <CheckIcon size={20} />
          </span>
        </span>

        <h2 id="password-updated-title" className="mt-[16px] text-[16px] font-bold leading-6 text-brand">
          Password Updated
        </h2>
        <p className="mt-[6px] text-[13px] leading-5 text-ink-muted">Your password has been changed successfully.</p>
      </div>
    </div>
  )
}
