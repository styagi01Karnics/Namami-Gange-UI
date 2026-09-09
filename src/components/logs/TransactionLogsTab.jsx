import { useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import StatusPill, { statusTone } from '../ui/StatusPill'
import ReportTable from '../reports/ReportTable'
import { transactionLogColumns, transactionLogRows } from '../../data/mockData'
import { filterRowsByStp } from '../../utils/stpScope'

function formatPayload(payload) {
  try {
    return JSON.stringify(JSON.parse(payload), null, 2)
  } catch {
    return payload
  }
}

export default function TransactionLogsTab({ stpId }) {
  const rows = useMemo(() => filterRowsByStp(transactionLogRows, stpId), [stpId])

  return (
    <ReportTable
      nested
      columns={transactionLogColumns}
      rows={rows}
      rowKey={(row) => row.uniqueId}
      searchKeys={['id', 'uniqueId', 'status']}
      searchPlaceholder="Search logs"
      minWidth={980}
      emptyMessage="No transaction logs for this STP."
      renderCell={(row, col, { isExpanded, toggle }) => {
        if (col.key === 'status') {
          return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
        }

        if (col.key === 'details') {
          return (
            <button
              type="button"
              onClick={toggle}
              aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${row.uniqueId}`}
              aria-expanded={isExpanded}
              className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-line bg-[#F5F7FA] text-[#5B6B7F] transition-colors hover:border-brand hover:text-brand"
            >
              <ChevronDown size={17} strokeWidth={2.1} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )
        }

        return row[col.key]
      }}
      renderDetail={(row) => (
        <pre className="overflow-x-auto rounded-[8px] bg-[#F4F7FB] px-[14px] py-[12px] text-[12px] leading-[18px] text-ink">
          {formatPayload(row.payload)}
        </pre>
      )}
    />
  )
}
