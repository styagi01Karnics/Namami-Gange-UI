import { Fragment } from 'react'

type GroupedTabsProps = {
  tabs: string[]
  active: string
  onChange: (tab: string) => void
  className?: string
}

/**
 * Table filter tabs as one grouped control. The selected item highlights
 * in place; dividers sit only between the inactive neighbours.
 */
export default function GroupedTabs({ tabs, active, onChange, className = '' }: GroupedTabsProps) {
  return (
    <div className={className}>
      <div className="inline-flex h-[36px] max-w-full items-center overflow-x-auto rounded-[10px] bg-[#E7F3FE] p-[3px]">
        {tabs.map((tab, i) => {
          const isActive = tab === active
          const showDivider = i > 0 && !isActive && tabs[i - 1] !== active

          return (
            <Fragment key={tab}>
              {showDivider && <span className="mx-[2px] h-[14px] w-px shrink-0 bg-[#C5D9EE]" />}
              <button
                type="button"
                onClick={() => onChange(tab)}
                className={`h-full shrink-0 px-[14px] text-[13px] leading-4 transition-colors ${
                  isActive
                    ? 'rounded-[8px] bg-brand font-semibold text-white'
                    : 'rounded-[8px] font-medium text-ink hover:text-brand'
                }`}
              >
                {tab}
              </button>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
