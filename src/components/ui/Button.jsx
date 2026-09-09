const VARIANTS = {
  primary: 'bg-brand text-white hover:bg-[#1259C7]',
  ghost: 'border border-line bg-white text-ink hover:bg-[#F4F7FB]',
  outline: 'border border-[#BFD8F8] bg-white text-brand hover:bg-brand-soft',
  danger: 'border border-[#F6C9CB] bg-white text-danger hover:bg-danger-soft',
}

export default function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button
      type="button"
      className={`inline-flex h-[38px] items-center justify-center gap-[8px] rounded-[9px] px-[16px] text-[13px] font-semibold leading-4 transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
