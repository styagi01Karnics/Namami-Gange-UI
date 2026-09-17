import type { InputHTMLAttributes, ReactNode } from 'react'

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode
  hint?: ReactNode
  children?: ReactNode
  className?: string
}

export default function Field({ label, hint, children, className = '', ...inputProps }: FieldProps) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-[7px] block text-[12.5px] font-medium leading-4 text-ink-soft">{label}</span>
      {children ?? (
        <input
          className="h-[38px] w-full rounded-[9px] border border-line bg-white px-[13px] text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
          {...inputProps}
        />
      )}
      {hint && <span className="mt-[6px] block text-[11.5px] leading-4 text-ink-muted">{hint}</span>}
    </label>
  )
}
