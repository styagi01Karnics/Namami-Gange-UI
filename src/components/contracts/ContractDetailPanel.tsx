import { Fragment } from 'react'
import PdfIcon from '../ui/PdfIcon'

function Value({ row }) {
  if (row.type === 'file') {
    return (
      <button
        type="button"
        className="flex items-center gap-[8px] text-left text-[13px] font-semibold leading-[18px] text-ink transition-colors hover:text-brand"
      >
        <PdfIcon size={15} />
        {row.value}
      </button>
    )
  }
  return <span className="text-[13px] font-semibold leading-[18px] text-ink">{row.value}</span>
}

export default function ContractDetailPanel({ groups, description }) {
  return (
    <div className="rounded-[12px] border border-line bg-canvas p-[18px]">
      <div className="grid grid-cols-3">
        {groups.map((group, i) => (
          <div key={group.title} className={i > 0 ? 'border-l border-line pl-[22px]' : 'pr-[22px]'}>
            <h4 className="text-[14.5px] font-medium leading-5 text-brand">{group.title}</h4>
            <dl className="mt-[15px] grid grid-cols-[auto_1fr] items-center gap-x-[16px] gap-y-[13px]">
              {group.rows.map((row) => (
                <Fragment key={row.label}>
                  <dt className="text-[13px] leading-[18px] text-ink-soft">{row.label}</dt>
                  <dd className="m-0 min-w-0">
                    <Value row={row} />
                  </dd>
                </Fragment>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {description && (
        <div className="mt-[18px]">
          <h4 className="text-[14.5px] font-medium leading-5 text-brand">Agreement Description</h4>
          <p className="mt-[10px] rounded-[9px] border border-line bg-white px-[16px] py-[12px] text-[13px] leading-[18px] text-ink">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}
