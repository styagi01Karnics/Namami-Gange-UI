import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import PasswordField from './PasswordField'

const LockIcon = ico('fluent:lock-closed-24-filled')
const FileIcon = ico('famicons:document-sharp')

const EMPTY = { current: '', next: '', confirm: '' }

const RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'letter', label: 'One letter', test: (v) => /[a-zA-Z]/.test(v) },
  { key: 'special', label: 'One special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
]

export default function ChangePasswordModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setForm(EMPTY)
  }, [open])

  if (!open) return null

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const rulesOk = RULES.every((r) => r.test(form.next))
  const canSubmit = form.current.trim() && rulesOk && form.next === form.confirm

  const handleSubmit = () => {
    if (!canSubmit) return
    onSuccess()
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] overflow-hidden rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex items-start justify-between gap-[12px] px-[22px] pb-[14px] pt-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-brand-soft text-brand">
              <LockIcon size={16} />
            </span>
            <h2 id="change-password-title" className="text-[16px] font-extrabold leading-6 text-ink">
              Change Password
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-line text-ink-soft hover:text-brand"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="px-[22px] pb-[18px]">
          <section className="overflow-hidden rounded-[10px] border border-line">
            <header className="flex items-center gap-[9px] bg-[#EEF5FE] px-[14px] py-[10px]">
              <FileIcon size={16} className="text-brand" />
              <h3 className="text-[13px] font-bold leading-[18px] text-brand">Account Details</h3>
            </header>

            <div className="space-y-[12px] p-[14px]">
              <PasswordField
                label="Current Password"
                required
                value={form.current}
                onChange={set('current')}
                placeholder="Enter Password"
              />
              <PasswordField
                label="New Password"
                required
                value={form.next}
                onChange={set('next')}
                placeholder="Enter New Password"
              />
              <PasswordField
                label="Confirm Password"
                value={form.confirm}
                onChange={set('confirm')}
                placeholder="Confirm Password"
              />

              <div>
                <p className="text-[12.5px] font-semibold leading-4 text-ink-soft">Password Must Contain</p>
                <ul className="mt-[8px] space-y-[6px]">
                  {RULES.map((rule) => {
                    const ok = rule.test(form.next)
                    return (
                      <li key={rule.key} className="flex items-center gap-[8px] text-[12.5px] leading-4 text-ink-soft">
                        <span className={`h-[7px] w-[7px] shrink-0 rounded-full ${ok ? 'bg-ok' : 'bg-brand'}`} />
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-[10px] px-[22px] pb-[18px]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Apply Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
