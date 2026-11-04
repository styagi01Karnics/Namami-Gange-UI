import { useRef } from 'react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import ConfirmDialog from '../ui/ConfirmDialog'
import Field from '../ui/Field'
import Toast from '../ui/Toast'
import { PHOTO_ACCEPT } from '../../api/profile'
import type { useMyProfile } from '../../hooks/useMyProfile'

type ProfileHook = ReturnType<typeof useMyProfile>

export default function ProfileDetails({ hook }: { hook: ProfileHook }) {
  const fileInput = useRef<HTMLInputElement>(null)
  const { profile, photoPreview, phone, setPhone, loading, busy, feedback, dismissFeedback } = hook

  let photoHint = 'Select a PNG or JPG up to 2 MB. It is saved when you click Save changes.'
  if (hook.hasPendingPhoto) {
    photoHint = 'New photo selected. It is saved when you click Save changes.'
  }

  return (
    <>
      <div className="flex items-center gap-[16px]">
        <Avatar size={64} photoUrl={photoPreview} />
        <div>
          <p className="text-[13.5px] font-semibold leading-5 text-ink">Profile photo</p>
          <p className="mt-[3px] text-[12px] leading-4 text-ink-muted">{photoHint}</p>
          <div className="mt-[10px] flex gap-[8px]">
            <input
              ref={fileInput}
              type="file"
              accept={PHOTO_ACCEPT}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                e.target.value = ''
                if (file) hook.selectPhoto(file)
              }}
            />
            <Button
              variant="outline"
              className="h-[32px] px-[13px]"
              disabled={busy || loading}
              onClick={() => fileInput.current?.click()}
            >
              Change photo
            </Button>
            <Button
              variant="ghost"
              className="h-[32px] px-[13px]"
              disabled={busy || loading || !photoPreview}
              onClick={hook.requestRemovePhoto}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-[18px] grid grid-cols-2 gap-x-[18px] gap-y-[16px]">
        <Field label="Full name" value={profile?.name ?? ''} readOnly />
        <Field label="Role" value={profile?.role ?? ''} readOnly />
        <Field label="Email address" type="email" value={profile?.email ?? ''} readOnly />
        <Field
          label="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={loading}
        />
      </div>

      <ConfirmDialog
        open={hook.confirmRemoveOpen}
        title="Delete profile photo"
        message="Are you sure you want to delete your profile photo?"
        confirmLabel="Delete"
        onConfirm={() => void hook.confirmRemovePhoto()}
        onCancel={hook.cancelRemovePhoto}
      />
      <Toast feedback={feedback} onClose={dismissFeedback} />
    </>
  )
}
