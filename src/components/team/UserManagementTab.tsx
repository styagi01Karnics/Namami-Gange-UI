import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ChevronDown, RefreshCw } from 'lucide-react'
import { ico } from '../ui/Ico'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import DataTable from '../ui/DataTable'
import Select from '../ui/Select'
import SoftStatCardsRow from '../ui/SoftStatCard'
import StatusPill, { statusTone } from '../ui/StatusPill'
import TeamSectionHeader from './TeamSectionHeader'
import AddUserModal from './AddUserModal'
import ConfirmModal from '../ui/ConfirmModal'
import { ROLE_TONE } from './teamTheme'
import { downloadCsv } from '../../lib/csv'
import {
  fetchUsers,
  createUser,
  patchUser,
  deleteUser,
  type UserItem,
  type UserRequest,
} from '../../api/users'
import { fetchRoles } from '../../api/roles'

export const teamUserColumns = [
  { key: 'name', label: 'User', width: '19%' },
  { key: 'phone', label: 'Phone', width: '15%' },
  { key: 'email', label: 'Email', width: '22%' },
  { key: 'role', label: 'Role', width: '15%', sortable: true },
  { key: 'status', label: 'Status', width: '11%', sortable: true },
  { key: 'lastLogin', label: 'Last Login', width: '13%' },
  { key: 'actions', label: 'Actions', width: '10%' },
]

export const buildTeamUserStats = (rows: any[], roleCount: number) => {
  const count = (status: string) => rows.filter((r) => r.status === status).length
  const share = (n: number) => (rows.length === 0 ? '0%' : `${((n / rows.length) * 100).toFixed(1)}%`)
  const active = count('Active')
  const inactive = count('Inactive')

  return [
    { key: 'total', label: 'Total Users', value: rows.length, note: "Across all STP's", tone: 'brand' as const },
    { key: 'active', label: 'Active Users', value: active, note: share(active), tone: 'ok' as const },
    { key: 'inactive', label: 'Non-Active Users', value: inactive, note: share(inactive), tone: 'danger' as const },
    { key: 'roles', label: 'Roles', value: roleCount, note: 'System Roles', tone: 'violet' as const },
  ]
}

const PencilIcon = ico('fluent:edit-24-filled')
const PlusIcon = ico('fluent:add-24-filled')
const TrashIcon = ico('fluent:delete-24-filled')
const CheckIcon = ico('fluent:checkmark-24-filled')

const CSV_COLUMNS = teamUserColumns
  .filter((c) => c.key !== 'actions')
  .map((c) => ({ key: c.key, label: c.label }))

const STATUS_FILTER = ['All Status', 'Active', 'Inactive']
const STATUS_OPTIONS = ['Active', 'Inactive']

function ChipSelect({ value, options, onChange }: any) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return undefined
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
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
        <span className="truncate">{value || 'Select'}</span>
        <ChevronDown size={13} strokeWidth={2.4} className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="absolute left-0 z-40 mt-[6px] min-w-full overflow-hidden rounded-[10px] border border-line bg-white py-[5px] shadow-pop">
          {options.length === 0 ? (
            <li className="px-[14px] py-[7px] text-[12px] text-ink-muted">No roles available</li>
          ) : (
            options.map((option: string) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={`block w-full px-[14px] py-[7px] text-left text-[12px] transition-colors hover:bg-brand-soft hover:text-brand ${
                    option === value ? 'font-semibold text-brand' : 'text-ink'
                  }`}
                >
                  {option}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

export default function UserManagementTab({
  onExportPdf,
  roleFilter = 'All Roles',
  onRoleFilterChange,
}: {
  onExportPdf?: any
  roleFilter?: string
  onRoleFilterChange?: (role: string) => void
}) {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [role, setRole] = useState(roleFilter)
  const [status, setStatus] = useState('All Status')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState({ role: '', status: '' })
  const [savingEdit, setSavingEdit] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<UserItem | null>(null)

  const selectedRole = onRoleFilterChange ? roleFilter : role
  const setSelectedRole = onRoleFilterChange ?? setRole
  const roleFilterList = ['All Roles', ...availableRoles]
  const roleOptions = roleFilterList.includes(selectedRole) ? roleFilterList : [...roleFilterList, selectedRole]

  // 1. GET /api/users from database
  const loadUsers = async () => {
    try {
      setLoading(true)
      setApiError('')
      const data = await fetchUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('Failed to load users from database:', err)
      setUsers([])
      setApiError(err?.message || 'Failed to connect to database. Please verify user-service is running.')
    } finally {
      setLoading(false)
    }
  }

  const [roleItems, setRoleItems] = useState<{ id: string; name: string }[]>([])

  // Load available roles from database
  const loadRoles = async () => {
    try {
      const roleCards = await fetchRoles()
      if (roleCards?.length) {
        setRoleItems(roleCards.map((r) => ({ id: r.id, name: r.name })))
        const names = roleCards.map((r) => r.name).filter(Boolean)
        setAvailableRoles(Array.from(new Set(names)))
      } else {
        setRoleItems([])
        setAvailableRoles([])
      }
    } catch {
      setRoleItems([])
      setAvailableRoles([])
    }
  }

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [])

  const rows = useMemo(
    () =>
      users.filter(
        (u) =>
          (selectedRole === 'All Roles' || u.role === selectedRole) &&
          (status === 'All Status' || u.status === status),
      ),
    [users, selectedRole, status],
  )

  // Dynamic statistics calculated exclusively from database records
  const stats = useMemo(() => buildTeamUserStats(users as any, availableRoles.length), [users, availableRoles])

  // POST /api/users
  const handleAddUser = async (userPayload: UserRequest) => {
    const matched = roleItems.find((r) => r.name.toLowerCase() === (userPayload.role || '').toLowerCase())
    const payloadWithRoleId: UserRequest = {
      ...userPayload,
      roleId: userPayload.roleId || matched?.id,
    }
    await createUser(payloadWithRoleId)
    await loadUsers()
  }

  const startEdit = (row: UserItem) => {
    setEditingId(row.id)
    setDraft({ role: row.role, status: row.status })
  }

  // PATCH /api/users/{id}
  const saveEdit = async () => {
    if (!editingId) return
    try {
      setSavingEdit(true)
      await patchUser(editingId, { role: draft.role, status: draft.status })
      setEditingId(null)
      await loadUsers()
    } catch (err: any) {
      alert(err?.message || 'Failed to update user.')
    } finally {
      setSavingEdit(false)
    }
  }

  // DELETE /api/users/{id}
  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      setDeleteError('')
      await deleteUser(pendingDelete.id)
      if (pendingDelete.id === editingId) setEditingId(null)
      setPendingDelete(null)
      await loadUsers()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete user')
    }
  }

  const renderCell = (row: UserItem, col: any) => {
    if (col.key === 'name') {
      return (
        <span className="flex items-center gap-[10px]">
          <Avatar size={32} />
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold leading-[22px] text-[#07121E]">{row.name}</span>
            <span className="block text-[12px] font-medium leading-4 text-[#0768D2]">{row.userId}</span>
          </span>
        </span>
      )
    }

    if (col.key === 'role') {
      if (editingId === row.id) {
        return (
          <ChipSelect
            value={draft.role}
            options={availableRoles}
            onChange={(selected: string) => setDraft((d) => ({ ...d, role: selected }))}
          />
        )
      }
      return (
        <StatusPill
          tone={ROLE_TONE[row.role] ?? 'slate'}
          className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
        >
          {row.role || '—'}
        </StatusPill>
      )
    }

    if (col.key === 'status') {
      if (editingId === row.id) {
        return (
          <ChipSelect
            value={draft.status}
            options={STATUS_OPTIONS}
            onChange={(selected: string) => setDraft((d) => ({ ...d, status: selected }))}
          />
        )
      }
      return (
        <StatusPill
          tone={statusTone(row.status)}
          className="h-[32px] min-w-[88px] justify-center px-[8px] text-[14px] leading-4"
        >
          {row.status}
        </StatusPill>
      )
    }

    if (col.key === 'actions') {
      return (
        <span className="flex items-center gap-[8px]">
          <button
            type="button"
            onClick={() => {
              setDeleteError('')
              setPendingDelete(row)
            }}
            aria-label={`Remove ${row.name}`}
            className="inline-flex items-center justify-center rounded-[4px] border border-[#F6C9CB] bg-[#FDECEC] p-[6px] text-[#DC2626] transition-opacity hover:opacity-90"
          >
            <TrashIcon size={20} />
          </button>
          <button
            type="button"
            disabled={savingEdit}
            onClick={() => (editingId === row.id ? saveEdit() : startEdit(row))}
            aria-label={editingId === row.id ? `Save ${row.name}` : `Edit ${row.name}`}
            className={`inline-flex items-center justify-center rounded-[4px] p-[6px] transition-opacity hover:opacity-90 ${
              editingId === row.id
                ? 'bg-[#0768D2] text-white'
                : 'border border-[rgba(7,104,210,0.4)] bg-[#D7EDFF] text-[#0768D2]'
            }`}
          >
            {editingId === row.id ? <CheckIcon size={20} /> : <PencilIcon size={20} />}
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
          <div className="flex items-center gap-[10px]">
            <Button
              variant="outline"
              onClick={loadUsers}
              className="flex items-center gap-[6px] text-[13px]"
              title="Refresh users from database"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button onClick={() => setModalOpen(true)}>
              Add User
              <PlusIcon size={16} />
            </Button>
          </div>
        }
      />

      {apiError && (
        <div className="flex items-center justify-between rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>
              <strong>Database Error:</strong> {apiError}
            </span>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="ml-4 font-semibold text-red-700 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {deleteError && (
        <div className="flex items-center justify-between rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
          <span>{deleteError}</span>
          <button
            type="button"
            onClick={() => setDeleteError('')}
            className="font-semibold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <SoftStatCardsRow items={stats} columns={4} gap={14} />

      <DataTable
        columns={teamUserColumns}
        rows={rows}
        searchKeys={['name', 'email', 'phone', 'role', 'status', 'userId']}
        renderCell={renderCell}
        minWidth={1100}
        toolbarFill
        filters={
          <>
            <Select
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              className="min-w-0 flex-1"
              buttonClassName="h-[40px]"
            />
            <Select
              options={STATUS_FILTER}
              value={status}
              onChange={setStatus}
              className="min-w-0 flex-1"
              buttonClassName="h-[40px]"
            />
          </>
        }
        onExportCsv={(visible) => downloadCsv('team-users', CSV_COLUMNS, visible)}
        onExportPdf={(visible) => onExportPdf?.('Team — Users', CSV_COLUMNS, visible)}
        emptyMessage={
          loading
            ? 'Loading users from database...'
            : apiError
              ? `Unable to load users: ${apiError}`
              : 'No users found in database.'
        }
      />

      <AddUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddUser}
        roleOptions={availableRoles}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete User"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
