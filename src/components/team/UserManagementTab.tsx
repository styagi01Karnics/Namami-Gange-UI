import { useMemo, useState } from 'react'
import { ico } from '../ui/Ico'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import StatCardsRow from '../ui/StatCardsRow'
import StatusPill, { statusTone } from '../ui/StatusPill'
import TeamSectionHeader from './TeamSectionHeader'
import AddUserModal from './AddUserModal'
import { ROLE_TONE } from './teamTheme'
import { downloadCsv } from '../../lib/csv'
import { buildTeamUserStats, teamRoleNames, teamUserColumns, teamUsers } from '../../data/mockData'

const PencilIcon = ico('fluent:edit-24-filled')
const PlusIcon = ico('fluent:add-24-filled')
const TrashIcon = ico('fluent:delete-24-filled')

const CSV_COLUMNS = teamUserColumns
  .filter((c) => c.key !== 'actions')
  .map((c) => ({ key: c.key, label: c.label }))

const ROLE_FILTER = ['All Roles', ...teamRoleNames]
const STATUS_FILTER = ['All Status', 'Active', 'Inactive']

export default function UserManagementTab({ onExportPdf }) {
  const [users, setUsers] = useState(teamUsers)
  const [role, setRole] = useState('All Roles')
  const [status, setStatus] = useState('All Status')
  const [modalOpen, setModalOpen] = useState(false)

  const rows = useMemo(
    () =>
      users.filter(
        (u) => (role === 'All Roles' || u.role === role) && (status === 'All Status' || u.status === status),
      ),
    [users, role, status],
  )

  // Cards count the whole directory, not just the rows left by the filters.
  const stats = useMemo(() => buildTeamUserStats(users, teamRoleNames.length), [users])

  const addUser = (user) =>
    setUsers((prev) => [
      {
        id: `u-${Date.now()}`,
        userId: `#${1231468 + prev.length}`,
        lastLogin: '—',
        ...user,
      },
      ...prev,
    ])

  const removeUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id))

  const renderCell = (row, col) => {
    if (col.key === 'name') {
      return (
        <span className="flex items-center gap-[10px]">
          <Avatar size={32} />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold leading-[18px] text-ink">{row.name}</span>
            <span className="block text-[12px] leading-4 text-brand-link">{row.userId}</span>
          </span>
        </span>
      )
    }

    if (col.key === 'role') return <StatusPill tone={ROLE_TONE[row.role] ?? 'slate'}>{row.role}</StatusPill>
    if (col.key === 'status') return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>

    if (col.key === 'actions') {
      return (
        <span className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => removeUser(row.id)}
            aria-label={`Remove ${row.name}`}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#F6C9CB] text-danger transition-colors hover:bg-danger-soft"
          >
            <TrashIcon size={15} />
          </button>
          <button
            type="button"
            aria-label={`Edit ${row.name}`}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#BFD8F8] text-brand transition-colors hover:bg-brand-soft"
          >
            <PencilIcon size={15} />
          </button>
        </span>
      )
    }

    return undefined
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader
        tab="User Management"
        right={
          <Button onClick={() => setModalOpen(true)}>
            Add User
            <PlusIcon size={16} />
          </Button>
        }
      />

      <StatCardsRow items={stats} columns={4} gap={14} noteChip />

      <DataTable
        columns={teamUserColumns}
        rows={rows}
        searchKeys={['name', 'email', 'phone', 'role', 'status', 'userId']}
        renderCell={renderCell}
        minWidth={1100}
        filters={
          <>
            <Select options={ROLE_FILTER} value={role} onChange={setRole} className="w-[190px]" buttonClassName="h-[34px]" />
            <Select options={STATUS_FILTER} value={status} onChange={setStatus} className="w-[170px]" buttonClassName="h-[34px]" />
          </>
        }
        onExportCsv={(visible) => downloadCsv('team-users', CSV_COLUMNS, visible)}
        onExportPdf={(visible) => onExportPdf?.('Team — Users', CSV_COLUMNS, visible)}
        emptyMessage="No users match your filters."
      />

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addUser} />
    </div>
  )
}
