import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Field from '../ui/Field'
import { settingsProfile } from '../../data/mockData'

const PersonIcon = ico('fluent:person-32-filled')

export default function ProfileModal({ open, onClose }) {
  const [form, setForm] = useState(settingsProfile)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setForm(settingsProfile)
  }, [open])

  if (!open) return null

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] overflow-hidden rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex items-start justify-between gap-[12px] px-[22px] pb-[14px] pt-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-brand-soft text-brand">
              <PersonIcon size={16} />
            </span>
            <h2 id="profile-title" className="text-[16px] font-bold leading-6 text-ink">
              My Profile
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

        <div className="px-[22px] pb-[8px]">
          <div className="flex items-center gap-[16px]">
            <Avatar size={64} />
            <div>
              <p className="text-[13.5px] font-semibold leading-5 text-ink">Profile photo</p>
              <p className="mt-[3px] text-[12px] leading-4 text-ink-muted">PNG or JPG, up to 2 MB.</p>
              <div className="mt-[10px] flex gap-[8px]">
                <Button variant="outline" className="h-[32px] px-[13px]">
                  Change photo
                </Button>
                <Button variant="ghost" className="h-[32px] px-[13px]">
                  Remove
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-[18px] grid grid-cols-2 gap-x-[18px] gap-y-[16px]">
            <Field label="Full name" value={form.name} onChange={set('name')} />
            <Field label="Designation" value={form.designation} onChange={set('designation')} />
            <Field label="Email address" type="email" value={form.email} onChange={set('email')} />
            <Field label="Phone number" value={form.phone} onChange={set('phone')} />
            <Field label="Employee ID" value={form.employeeId} onChange={set('employeeId')} />
            <Field label="Reporting office" value={form.office} onChange={set('office')} />
          </div>
        </div>

        <div className="mt-[10px] flex items-center justify-end gap-[10px] px-[22px] py-[16px]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save changes</Button>
        </div>
      </div>
    </div>
  )
}
