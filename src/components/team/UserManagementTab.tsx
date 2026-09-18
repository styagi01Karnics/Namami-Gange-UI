import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import StatCardsRow from '../ui/StatCardsRow'
import StatusPill, { statusTone } from '../ui/StatusPill'
import TeamSectionHeader from './TeamSectionHeader'
import AddUserModal from './AddUserModal'
import ConfirmModal from '../ui/ConfirmModal'
import { ROLE_TONE } from './teamTheme'
import { downloadCsv } from '../../lib/csv'
import { buildTeamUserStats, teamRoleNames, teamUserColumns, teamUsers } from '../../data/mockData'

const PencilIcon = ico('fluent:edit-24-filled')
const PlusIcon = ico('fluent:add-24-filled')
const TrashIcon = ico('fluent:delete-24-filled')
const CheckIcon = ico('fluent:checkmark-24-filled')

const CSV_COLUMNS = teamUserColumns
  .filter((c) => c.key !== 'actions')
  .map((c) => ({ key: c.key, label: c.label }))

const ROLE_FILTER = ['All Roles', ...teamRoleNames]
const STATUS_FILTER = ['All Status', 'Active', 'Inactive']
const STATUS_OPTIONS = ['Active', 'Inactive']

function ChipSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex max-w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-full items-center gap-[4px] rounded-full bg-brand-soft px-[11px] py-[3px] text-[11.5px] font-semibold leading-[16px] text-brand"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={13} strokeWidth={2.4} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute left-0 z-40 mt-[6px] min-w-full overflow-hidden rounded-[10px] border border-line bg-white py-[5px] shadow-pop">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option)
                  setOpen(false)
                }}
                className={`flex w-full whitespace-nowrap px-[12px] py-[7px] text-left text-[12.5px] transition-colors ${
                  option === value ? 'bg-brand-soft font-semibold text-brand' : 'text-ink hover:bg-[#F5F9FE]'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function UserManagementTab({ onExportPdf, roleFilter = 'All Roles', onRoleFilterChange }) {
  const [users, setUsers] = useState(teamUsers)
  const [role, setRole] = useState(roleFilter)
  const [status, setStatus] = useState('All Status')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ role: '', status: '' })
  const [pendingDelete, setPendingDelete] = useState(null)

  const selectedRole = onRoleFilterChange ? roleFilter : role
  const setSelectedRole = onRoleFilterChange ?? setRole
  const roleOptions = ROLE_FILTER.includes(selectedRole) ? ROLE_FILTER : [...ROLE_FILTER, selectedRole]

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          (selectedRole === 'All Roles' || u.role === selectedRole) &&
          (status === 'All Status' || u.status === status),
      ),
    [users, selectedRole, status],
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

  const startEdit = (row) => {
    setEditingId(row.id)
    setDraft({ role: row.role, status: row.status })
  }

  const saveEdit = () => {
    setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, role: draft.role, status: draft.status } : u)))
    setEditingId(null)
  }

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

    if (col.key === 'role') {
      if (editingId === row.id) {
        return <ChipSelect value={draft.role} options={teamRoleNames} onChange={(role) => setDraft((d) => ({ ...d, role }))} />
      }
      return <StatusPill tone={ROLE_TONE[row.role] ?? 'slate'}>{row.role}</StatusPill>
    }

    if (col.key === 'status') {
      if (editingId === row.id) {
        return (
          <ChipSelect value={draft.status} options={STATUS_OPTIONS} onChange={(status) => setDraft((d) => ({ ...d, status }))} />
        )
      }
      return <StatusPill tone={statusTone(row.status)}>{row.status}</StatusPill>
    }

    if (col.key === 'actions') {
      return (
        <span className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => setPendingDelete(row)}
            aria-label={`Remove ${row.name}`}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#F6C9CB] text-danger transition-colors hover:bg-danger-soft"
          >
            <TrashIcon size={15} />
          </button>
          <button
            type="button"
            onClick={() => (editingId === row.id ? saveEdit() : startEdit(row))}
            aria-label={editingId === row.id ? `Save ${row.name}` : `Edit ${row.name}`}
            className={`flex h-[30px] w-[30px] items-center justify-center rounded-[8px] transition-colors ${
              editingId === row.id
                ? 'bg-brand text-white hover:bg-[#1259C7]'
                : 'border border-[#BFD8F8] text-brand hover:bg-brand-soft'
            }`}
          >
            {editingId === row.id ? <CheckIcon size={15} /> : <PencilIcon size={15} />}
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

      <StatCardsRow items={stats} columns={4} gap={14} />

      <DataTable
        columns={teamUserColumns}
        rows={rows}
        searchKeys={['name', 'email', 'phone', 'role', 'status', 'userId']}
        renderCell={renderCell}
        minWidth={1100}
        filters={
          <>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              className="w-[190px]"
              buttonClassName="h-[34px]"
            />
            <Select options={STATUS_FILTER} value={status} onChange={setStatus} className="w-[170px]" buttonClassName="h-[34px]" />
          </>
        }
        onExportCsv={(visible) => downloadCsv('team-users', CSV_COLUMNS, visible)}
        onExportPdf={(visible) => onExportPdf?.('Team — Users', CSV_COLUMNS, visible)}
        emptyMessage="No users match your filters."
      />

      <AddUserModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addUser} />
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete User"
        message={`Are you sure you want to delete ${pendingDelete?.name}? This cannot be undone.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete.id === editingId) setEditingId(null)
          removeUser(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
