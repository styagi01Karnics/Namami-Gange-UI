import { useEffect } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'

const LogOutIcon = ico('fluent:sign-out-24-filled')

export default function LogoutModal({ open, onClose, onConfirm }) {
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
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-[24px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[16px] bg-white px-[28px] py-[30px] text-center shadow-pop"
      >
        <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-danger-soft">
          <LogOutIcon size={22} className="text-danger" />
        </span>

        <h2 id="logout-title" className="mt-[18px] text-[18px] font-bold leading-6 text-ink">
          Log Out
        </h2>
        <p className="mt-[8px] text-[13.5px] leading-5 text-ink-muted">
          Are you sure you want to log out your account
        </p>

        <div className="mt-[24px] flex items-center gap-[12px]">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}
