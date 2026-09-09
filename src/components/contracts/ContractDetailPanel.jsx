import PdfIcon from '../ui/PdfIcon'

function Value({ row }) {
  if (row.type === 'file') {
    return (
      <button
        type="button"
        className="flex items-center gap-[8px] text-left text-[13px] font-medium leading-[18px] text-ink transition-colors hover:text-brand"
      >
        <PdfIcon size={15} />
        {row.value}
      </button>
    )
  }
  return <span className="text-[13px] font-medium leading-[18px] text-ink">{row.value}</span>
}

export default function ContractDetailPanel({ groups }) {
  return (
    <div className="rounded-[12px] border border-line bg-white p-[18px]">
      <div className="grid grid-cols-3">
        {groups.map((group, i) => (
          <div key={group.title} className={i > 0 ? 'border-l border-line pl-[22px]' : 'pr-[22px]'}>
            <h4 className="text-[14.5px] font-medium leading-5 text-ink">{group.title}</h4>
            <dl className="mt-[15px] space-y-[13px]">
              {group.rows.map((row) => (
                <div key={row.label} className="flex items-start gap-[10px]">
                  <dt className="w-[150px] shrink-0 text-[13px] leading-[18px] text-ink-soft">{row.label}</dt>
                  <dd className="min-w-0 break-words">
                    <Value row={row} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
