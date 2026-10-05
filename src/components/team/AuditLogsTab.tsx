import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '../ui/Avatar'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import SoftStatCardsRow from '../ui/SoftStatCard'
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
        <span className="block truncate text-[14px] font-semibold leading-[22px] text-[#07121E]">{name}</span>
        <span className="block text-[12px] font-medium leading-4 text-[#0768D2]">{id}</span>
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
    if (col.key === 'action') {
      return (
        <StatusPill
          tone={ACTION_TONE[row.action] ?? 'slate'}
          className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
        >
          {row.action}
        </StatusPill>
      )
    }
    if (col.key === 'module') {
      return (
        <StatusPill
          tone="violet"
          className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
        >
          {row.module}
        </StatusPill>
      )
    }

    if (col.key === 'change') {
      return (
        <span className="block truncate text-[14px] font-medium leading-[22px] text-[#0768D2]">{row.change}</span>
      )
    }

    if (col.key === 'details') {
      return (
        <button
          type="button"
          onClick={toggleExpanded}
          aria-expanded={expanded}
          aria-label={`Details for ${row.id}`}
          className="inline-flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] p-[6px] text-[#0768D2] transition-opacity hover:opacity-90"
        >
          <ChevronDown size={20} strokeWidth={2} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )
    }

    return undefined
  }

  const renderExpanded = (row) => (
    <div className="rounded-[16px] bg-[#F4F8FE] p-[16px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
      <p className="text-[14px] font-semibold leading-[22px] text-[#0768D2]">Change Details</p>

      <div className="mt-[12px] grid grid-cols-3 gap-[16px]">
        {row.details.map((field) => (
          <div key={field.label}>
            <p className="text-[12px] font-medium leading-4 text-[#646464]">{field.label}</p>
            <p className="mt-[7px] rounded-[9px] border border-[#D8EDFF] bg-white px-[13px] py-[10px] text-[14px] font-medium leading-[22px] text-[#07121E]">
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

      <SoftStatCardsRow items={auditLogStats} columns={4} gap={14} />

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
