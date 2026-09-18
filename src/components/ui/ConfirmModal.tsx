import { useEffect } from 'react'
import { ico } from './Ico'
import Button from './Button'

const TrashIcon = ico('fluent:delete-24-filled')

type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  confirmLabel?: string
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete',
  message = 'Are you sure you want to delete this?',
  confirmLabel = 'Delete',
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-[24px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[16px] bg-white px-[28px] py-[30px] text-center shadow-pop"
      >
        <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-full bg-danger-soft">
          <TrashIcon size={22} className="text-danger" />
        </span>

        <h2 id="confirm-title" className="mt-[18px] text-[18px] font-extrabold leading-6 text-ink">
          {title}
        </h2>
        <p className="mt-[8px] text-[13.5px] leading-5 text-ink-muted">{message}</p>

        <div className="mt-[24px] flex items-center gap-[12px]">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 border-danger bg-danger text-white hover:bg-[#C8353A]"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
