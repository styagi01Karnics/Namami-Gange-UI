import { useMemo, useState, useEffect } from 'react'
import { ChevronDown, RefreshCw } from 'lucide-react'
import Avatar from '../ui/Avatar'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import SoftStatCardsRow from '../ui/SoftStatCard'
import StatusPill from '../ui/StatusPill'
import TeamSectionHeader from './TeamSectionHeader'
import { ACTION_TONE } from './teamTheme'
import { downloadCsv } from '../../lib/csv'

export const auditLogColumns = [
  { key: 'id', label: 'Log ID', width: '9%' },
  { key: 'member', label: 'Member', width: '18%' },
  { key: 'action', label: 'Action', width: '13%', sortable: true },
  { key: 'change', label: 'Change Description', width: '22%' },
  { key: 'module', label: 'Module', width: '13%', sortable: true },
  { key: 'performedBy', label: 'Performed By', width: '17%' },
  { key: 'details', label: 'Details', width: '8%' },
]

const CSV_COLUMNS = auditLogColumns
  .filter((c) => c.key !== 'details')
  .map((c) => ({ key: c.key, label: c.label }))

const AUDIT_ACTIONS = ['Role Updated', 'User Removed', 'Status Change', 'Member Added']
const ACTION_FILTER = ['All Actions', ...AUDIT_ACTIONS]

function computeAuditStats(items: any[]) {
  return [
    { key: 'total', label: 'Total Logs', value: items.length, note: 'System events', tone: 'brand' as const },
    { key: 'roleUpdated', label: 'Role Changes', value: items.filter((i) => i.action === 'Role Updated').length, note: 'Security updates', tone: 'violet' as const },
    { key: 'userActions', label: 'User Actions', value: items.filter((i) => i.action === 'Member Added' || i.action === 'User Removed').length, note: 'Membership changes', tone: 'ok' as const },
    { key: 'statusChanges', label: 'Status Changes', value: items.filter((i) => i.action === 'Status Change').length, note: 'State modifications', tone: 'danger' as const },
  ]
}

function Person({ name, id }: { name: string; id: string }) {
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

export default function AuditLogsTab({ onExportPdf }: { onExportPdf?: any }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [action, setAction] = useState('All Actions')

  useEffect(() => {
    // Audit logs fetched from API
    const loadAuditLogs = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${import.meta.env.VITE_USER_API_URL ?? 'http://45.195.229.15:18090/api'}/audit-logs`)
        if (res.ok) {
          const json = await res.json()
          setLogs(Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [])
        } else {
          setLogs([])
        }
      } catch {
        setLogs([])
      } finally {
        setLoading(false)
      }
    }
    loadAuditLogs()
  }, [])

  const rows = useMemo(
    () => (action === 'All Actions' ? logs : logs.filter((l) => l.action === action)),
    [action, logs],
  )

  const stats = useMemo(() => computeAuditStats(logs), [logs])

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

      <SoftStatCardsRow items={stats} columns={4} gap={14} />

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
