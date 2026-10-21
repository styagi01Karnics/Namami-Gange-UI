import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import TeamSectionHeader from './TeamSectionHeader'
import RoleCard from './RoleCard'
import CreateRoleModal from './CreateRoleModal'
import ConfirmModal from '../ui/ConfirmModal'
import RoleUsersModal from './RoleUsersModal'
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
  type RoleCardItem,
  type RoleRequest,
} from '../../api/roles'

const PlusIcon = ico('fluent:add-24-filled')

export default function RoleManagementTab({ onViewUsers }: { onViewUsers?: (roleName: string) => void }) {
  const [roles, setRoles] = useState<RoleCardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<RoleCardItem | null>(null)
  const [pendingDelete, setPendingDelete] = useState<RoleCardItem | null>(null)
  const [viewingUsersRole, setViewingUsersRole] = useState<RoleCardItem | null>(null)

  // 1. GET /api/roles - Fetch role cards from database
  const loadRoles = async () => {
    try {
      setLoading(true)
      setApiError('')
      const data = await fetchRoles()
      setRoles(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('Failed to load roles from database:', err)
      setRoles([])
      setApiError(err?.message || 'Failed to connect to database. Please verify role-service is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  // 5. POST /api/roles (create) & 6. PUT /api/roles/{id} (update)
  const saveRole = async (payload: RoleRequest) => {
    if (editing) {
      await updateRole(editing.id, payload)
      await loadRoles()
      return
    }

    await createRole(payload)
    await loadRoles()
  }

  // 7. DELETE /api/roles/{id}
  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      setDeleteError('')
      await deleteRole(pendingDelete.id)
      setPendingDelete(null)
      await loadRoles()
    } catch (err: any) {
      setDeleteError(err?.message || 'Failed to delete role')
    }
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader
        tab="Role Management"
        right={
          <div className="flex items-center gap-[10px]">
            <Button
              variant="outline"
              onClick={loadRoles}
              className="flex items-center gap-[6px] text-[13px]"
              title="Refresh roles from database"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <Button
              onClick={() => {
                setEditing(null)
                setModalOpen(true)
              }}
            >
              Create Role
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
            onClick={loadRoles}
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

      {loading ? (
        <div className="flex h-[200px] items-center justify-center rounded-[12px] border border-line bg-white shadow-card">
          <div className="flex items-center gap-2 text-[14px] text-ink-muted">
            <RefreshCw size={18} className="animate-spin text-brand" />
            Loading roles from database...
          </div>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-line bg-white py-[48px] text-center shadow-card">
          <p className="text-[14.5px] font-medium text-ink-muted">
            {apiError ? 'Unable to load roles from database.' : 'No roles found in database.'}
          </p>
          {!apiError && (
            <p className="mt-1 text-[12.5px] text-ink-soft">
              Click &ldquo;Create Role&rdquo; to add your first system role.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[16px]">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              onEdit={() => {
                setEditing(role)
                setModalOpen(true)
              }}
              onDelete={() => {
                setDeleteError('')
                setPendingDelete(role)
              }}
              onViewUsers={() => {
                setViewingUsersRole(role)
              }}
            />
          ))}
        </div>
      )}

      <CreateRoleModal
        open={modalOpen}
        role={editing}
        onClose={closeModal}
        onSubmit={saveRole}
      />

      <RoleUsersModal
        open={Boolean(viewingUsersRole)}
        role={viewingUsersRole}
        onClose={() => setViewingUsersRole(null)}
        onNavigateToUserManagement={onViewUsers}
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete Role"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This cannot be undone.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
