export default function Toggle({ checked, onChange, label = 'Toggle setting' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition-colors ${
        checked ? 'bg-brand' : 'bg-[#D6DEE8]'
      }`}
    >
      <span
        className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-all ${
          checked ? 'left-[21px]' : 'left-[3px]'
        }`}
      />
    </button>
  )
}
