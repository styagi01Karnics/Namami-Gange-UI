import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { roleStatusOptions, teamRoleNames } from '../../data/mockData'

const PersonAddIcon = ico('fluent:person-add-24-filled')

const EMPTY = { name: '', phone: '', email: '', role: '', status: 'Active' }

const fieldClass =
  'h-[38px] w-full rounded-[9px] border border-line bg-white px-[13px] text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand'

export default function AddUserModal({ open, onClose, onSubmit }) {
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
  const canSubmit = form.name.trim() && form.email.trim() && form.role

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: form.name.trim(),
      phone: form.phone.trim() || '—',
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    })
    onClose()
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] rounded-[16px] bg-white p-[22px] shadow-pop"
      >
        <div className="flex items-start justify-between gap-[12px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-brand-soft text-brand">
              <PersonAddIcon size={18} />
            </span>
            <h2 id="add-user-title" className="text-[17px] font-extrabold leading-6 text-ink">
              Add User
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

        <div className="mt-[14px] space-y-[12px]">
          <label className="block">
            <span className="mb-[6px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Name *</span>
            <input
              value={form.name}
              onChange={(e) => set('name')(e.target.value)}
              placeholder="Full name"
              className={fieldClass}
            />
          </label>

          <div className="grid grid-cols-2 gap-[12px]">
            <label className="block">
              <span className="mb-[6px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Phone</span>
              <input
                value={form.phone}
                onChange={(e) => set('phone')(e.target.value)}
                placeholder="+91 9856452310"
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-[6px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Email *</span>
              <input
                value={form.email}
                onChange={(e) => set('email')(e.target.value)}
                placeholder="name@example.com"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-[12px]">
            <div>
              <span className="mb-[6px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Role *</span>
              <Select options={teamRoleNames} value={form.role} onChange={set('role')} placeholder="Select Role" />
            </div>

            <div>
              <span className="mb-[6px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Status</span>
              <Select options={roleStatusOptions} value={form.status} onChange={set('status')} />
            </div>
          </div>
        </div>

        <div className="mt-[16px] flex items-center justify-end gap-[10px]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Add User
          </Button>
        </div>
      </div>
    </div>
  )
}
