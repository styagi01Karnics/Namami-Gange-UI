import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import StatCardsRow from '../ui/StatCardsRow'
import StatusPill from '../ui/StatusPill'
import TeamSectionHeader from './TeamSectionHeader'
import { ACTION_TONE } from './teamTheme'
import { downloadCsv } from '../../lib/csv'
import { auditActions, auditLogColumns, auditLogStats, auditLogs } from '../../data/mockData'

const CSV_COLUMNS = auditLogColumns
  .filter((c) => c.key !== 'details')
  .map((c) => ({ key: c.key, label: c.label }))

const ACTION_FILTER = ['All Actions', ...auditActions]

function Person({ name, id }) {
  return (
    <span className="flex items-center gap-[10px]">
      <Avatar size={30} />
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-semibold leading-[18px] text-ink">{name}</span>
        <span className="block text-[12px] leading-4 text-brand-link">{id}</span>
      </span>
    </span>
  )
}

export default function AuditLogsTab({ onExportPdf }) {
  const [action, setAction] = useState('All Actions')

  const rows = useMemo(
    () => (action === 'All Actions' ? auditLogs : auditLogs.filter((l) => l.action === action)),
    [action],
  )

  const renderCell = (row, col, { expanded, toggleExpanded }) => {
    if (col.key === 'member') return <Person name={row.member} id={row.memberId} />
    if (col.key === 'performedBy') return <Person name={row.performedBy} id={row.performedById} />
    if (col.key === 'action') return <StatusPill tone={ACTION_TONE[row.action] ?? 'slate'}>{row.action}</StatusPill>
    if (col.key === 'module') return <StatusPill tone="violet">{row.module}</StatusPill>

    if (col.key === 'change') {
      return <span className="block truncate text-[13px] leading-[18px] text-brand-link">{row.change}</span>
    }

    if (col.key === 'details') {
      return (
        <button
          type="button"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={`Details for ${row.id}`}
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#BFD8F8] text-brand transition-colors hover:bg-brand-soft"
        >
          <ChevronDown size={15} strokeWidth={2.2} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )
    }

    return undefined
  }

  const renderExpanded = (row) => (
    <div className="rounded-[10px] border border-line bg-[#F8FBFF] p-[16px]">
      <p className="text-[13.5px] font-semibold leading-5 text-brand-link">Change Details</p>

      <div className="mt-[12px] grid grid-cols-3 gap-[16px]">
        {row.details.map((field) => (
          <div key={field.label}>
            <p className="text-[12.5px] leading-4 text-ink-soft">{field.label}</p>
            <p className="mt-[7px] rounded-[9px] border border-line bg-white px-[13px] py-[10px] text-[13px] leading-[18px] text-ink">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader tab="Audit Logs" />

      <StatCardsRow items={auditLogStats} columns={4} gap={14} />

      <DataTable
        columns={auditLogColumns}
        rows={rows}
        searchKeys={['id', 'member', 'action', 'change', 'module', 'performedBy']}
        renderCell={renderCell}
        renderExpanded={renderExpanded}
        minWidth={1180}
        filters={
          <Select options={ACTION_FILTER} value={action} onChange={setAction} className="w-[220px]" buttonClassName="h-[34px]" />
        }
        onExportCsv={(visible) => downloadCsv('audit-logs', CSV_COLUMNS, visible)}
        onExportPdf={(visible) => onExportPdf?.('Team — Audit Logs', CSV_COLUMNS, visible)}
        emptyMessage="No activity matches your filters."
      />
    </div>
  )
}
