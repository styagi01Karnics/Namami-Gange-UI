import searchIcon from '@/assets/shared/icon-search.svg'
import chevronIcon from '@/assets/shared/icon-chevron-sm.svg'
import checkmarkIcon from '@/assets/shared/icon-checkmark.svg'
import ExportButtons from '@/components/ExportButtons'

type ReportFiltersProps = {
  showTitle?: boolean
  title?: string
  locationValue?: string
  showLocation?: boolean
  showParams?: boolean
  showInfluentEffluent?: boolean
  influentChecked?: boolean
  effluentChecked?: boolean
  showRaw?: boolean
  showSearchPlaceholder?: boolean
  showVendor?: boolean
}

const PARAMS =
  'BOD, COD, Flow, NH₄-N, TSS, pH, NO₃-N, Totalizer, TN, Temp., Phosphorus'

export default function ReportFilters({
  showTitle = true,
  title = 'Influent',
  locationValue = '68 MLD STP, Jagjeetpur, Haridwar',
  showLocation = true,
  showParams = true,
  showInfluentEffluent = true,
  influentChecked = true,
  effluentChecked = false,
  showRaw = true,
  showSearchPlaceholder = false,
  showVendor = false,
}: ReportFiltersProps) {
  return (
    <div className="flex flex-col gap-[16px] px-[16px] pt-[22px]">
      <div className="flex items-center justify-between gap-[16px]">
        {showTitle ? <h2 className="text-[16px] font-[590] text-[#07121e]">{title}</h2> : <div />}
        <div className="flex flex-1 items-center justify-end gap-[12px]">
          {showLocation ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[320px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#07121e]">{locationValue}</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-[calc(50%-0.5px)] size-[13px] -translate-x-1/2 -translate-y-1/2"
                  src={searchIcon}
                />
              </span>
            </button>
          ) : null}
          {showSearchPlaceholder ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[280px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Search STP</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-[calc(50%-0.5px)] size-[13px] -translate-x-1/2 -translate-y-1/2"
                  src={searchIcon}
                />
              </span>
            </button>
          ) : null}
          <ExportButtons />
        </div>
      </div>

      {(showParams || showInfluentEffluent || showRaw || showVendor || showSearchPlaceholder) && (
        <div className="flex flex-wrap items-center gap-[12px]">
          {showSearchPlaceholder && showVendor ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[280px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#7e7e7e]">Search STP</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-[calc(50%-0.5px)] size-[13px] -translate-x-1/2 -translate-y-1/2"
                  src={searchIcon}
                />
              </span>
            </button>
          ) : null}
          {showVendor ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[200px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#07121e]">All Vendors</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-1/2 h-[5.5px] w-[10px] -translate-x-1/2 -translate-y-1/2"
                  src={chevronIcon}
                />
              </span>
            </button>
          ) : null}
          {showParams ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[520px] flex-1 items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="truncate text-[12px] font-[510] leading-[24px] text-[#07121e]">{PARAMS}</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-1/2 h-[5.5px] w-[10px] -translate-x-1/2 -translate-y-1/2"
                  src={chevronIcon}
                />
              </span>
            </button>
          ) : null}
          {showInfluentEffluent ? (
            <>
              <CheckboxLabel label="Influent" checked={influentChecked} />
              <CheckboxLabel label="Effluent" checked={effluentChecked} />
            </>
          ) : null}
          {showRaw ? (
            <button
              type="button"
              className="flex h-[36px] min-w-[100px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#07121e]">RAW</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-1/2 h-[5.5px] w-[10px] -translate-x-1/2 -translate-y-1/2"
                  src={chevronIcon}
                />
              </span>
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

function CheckboxLabel({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-[8px]">
      <span
        className={
          checked
            ? 'relative flex size-[18px] items-center justify-center rounded-[4px] bg-[#003c7a]'
            : 'size-[18px] rounded-[4px] border border-[#003c7a]'
        }
      >
        {checked ? (
          <img alt="" className="h-[9px] w-[12.25px]" src={checkmarkIcon} />
        ) : null}
      </span>
      <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">{label}</span>
    </label>
  )
}
