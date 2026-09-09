import Toggle from '../ui/Toggle'

/** Heading + blurb at the top of a settings panel. */
export function PanelHeader({ title, blurb }) {
  return (
    <div className="border-b border-line px-[22px] pb-[16px] pt-[20px]">
      <h2 className="text-[16.5px] font-semibold leading-6 text-ink">{title}</h2>
      <p className="mt-[5px] text-[12.5px] leading-[18px] text-ink-muted">{blurb}</p>
    </div>
  )
}

/** Sub-heading inside a panel. */
export function GroupTitle({ children, className = '' }) {
  return (
    <h3 className={`text-[13.5px] font-semibold leading-5 text-brand-link ${className}`}>{children}</h3>
  )
}

/** Label + blurb on the left, a switch on the right. */
export function ToggleRow({ label, blurb, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-[18px] rounded-[10px] border border-line bg-[#FAFCFE] px-[15px] py-[13px]">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium leading-[18px] text-ink">{label}</span>
        {blurb && <span className="mt-[3px] block text-[12px] leading-[17px] text-ink-muted">{blurb}</span>}
      </span>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}

export function PanelFooter({ children }) {
  return (
    <div className="flex items-center justify-end gap-[10px] border-t border-line px-[22px] py-[16px]">
      {children}
    </div>
  )
}
