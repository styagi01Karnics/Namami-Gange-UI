import downloadIcon from '@/assets/shared/icon-download.svg'

export default function ExportButtons() {
  return (
    <div className="flex items-center gap-[12px]">
      {(['PDF', 'CSV'] as const).map((label) => (
        <button
          key={label}
          type="button"
          className="flex h-[36px] items-center gap-[8px] rounded-[8px] border border-[#0768d2] bg-white px-[14px]"
        >
          <span className="relative size-[16px] overflow-hidden">
            <img
              alt=""
              className="absolute top-1/2 left-1/2 h-[13.5px] w-[10.5px] -translate-x-1/2 -translate-y-1/2"
              src={downloadIcon}
            />
          </span>
          <span className="text-[12px] font-[510] leading-[24px] text-[#0768d2]">{label}</span>
        </button>
      ))}
    </div>
  )
}
