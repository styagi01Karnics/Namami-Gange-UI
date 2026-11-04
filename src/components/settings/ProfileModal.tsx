import { useEffect } from 'react'
import { X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import ProfileDetails from './ProfileDetails'
import { useMyProfile } from '../../hooks/useMyProfile'

const PersonIcon = ico('fluent:person-32-filled')

export default function ProfileModal({ open, onClose }) {
  const hook = useMyProfile()
  const { reload, discardChanges, confirmRemoveOpen } = hook

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && !confirmRemoveOpen) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, confirmRemoveOpen])

  useEffect(() => {
    if (open) reload()
  }, [open, reload])

  if (!open) return null

  const handleClose = () => {
    discardChanges()
    onClose()
  }

  return (
    <div
      role="presentation"
      onClick={handleClose}
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
            <h2 id="profile-title" className="text-[16px] font-extrabold leading-6 text-ink">
              My Profile
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-line text-ink-soft hover:text-brand"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="px-[22px] pb-[8px]">
          <ProfileDetails hook={hook} />
        </div>

        <div className="mt-[10px] flex items-center justify-end gap-[10px] px-[22px] py-[16px]">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={hook.saveChanges}
            disabled={hook.busy || hook.loading || !hook.isDirty}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
