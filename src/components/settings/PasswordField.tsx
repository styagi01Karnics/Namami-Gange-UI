import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { ico } from '../ui/Ico'

const LockIcon = ico('fluent:lock-closed-24-filled')

export default function PasswordField({ label, required, value, onChange, placeholder }: any) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-[7px] block text-[12.5px] font-semibold leading-4 text-ink-soft">
        {label}
        {required && <span className="text-danger"> *</span>}
      </span>
      <span className="relative flex items-center">
        <LockIcon size={15} className="pointer-events-none absolute left-[13px] text-ink-muted" />
        <input
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-[38px] w-full rounded-[9px] border border-line bg-white py-[8px] pl-[36px] pr-[40px] text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-[11px] text-ink-muted transition-colors hover:text-brand"
        >
          {visible ? <EyeOff size={16} strokeWidth={2} /> : <Eye size={16} strokeWidth={2} />}
        </button>
      </span>
    </label>
  )
}
