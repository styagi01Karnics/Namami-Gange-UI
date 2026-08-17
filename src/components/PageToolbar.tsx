import calendarIcon from '@/assets/shared/icon-calendar.svg'
import refreshIcon from '@/assets/shared/icon-refresh.svg'

type PageToolbarProps = {
  dateLabel?: string
}

export default function PageToolbar({
  dateLabel = '19 May 2026, 05:30 PM - 19 May 2026, 07:30 PM ',
}: PageToolbarProps) {
  return (
    <div className="mb-[16px] flex items-center justify-end gap-[12px]">
      <button
        type="button"
        className="flex h-[40px] min-w-[360px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
      >
        <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">{dateLabel}</span>
        <span className="relative size-[16px] overflow-hidden">
          <img alt="" className="absolute top-1/2 left-1/2 size-[12px] -translate-x-1/2 -translate-y-1/2" src={calendarIcon} />
        </span>
      </button>
      <button
        type="button"
        className="flex h-[40px] items-center gap-[8px] rounded-[8px] border border-[#0768d2] bg-white px-[14px]"
      >
        <span className="relative size-[16px] overflow-hidden">
          <img
            alt=""
            className="absolute top-1/2 left-1/2 h-[12px] w-[11.95px] -translate-x-1/2 -translate-y-1/2"
            src={refreshIcon}
          />
        </span>
        <span className="text-[12px] font-[510] leading-[24px] text-[#0768d2]">Refresh</span>
      </button>
    </div>
  )
}
