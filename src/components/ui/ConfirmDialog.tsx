import { useEffect } from 'react'
import Button from './Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={(e) => {
        e.stopPropagation()
        onCancel()
      }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[400px] rounded-[16px] bg-white p-[22px] shadow-pop"
      >
        <h3 id="confirm-title" className="text-[16px] font-extrabold leading-6 text-ink">
          {title}
        </h3>
        <p id="confirm-message" className="mt-[8px] text-[13.5px] leading-5 text-ink-soft">
          {message}
        </p>
        <div className="mt-[20px] flex justify-end gap-[10px]">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
