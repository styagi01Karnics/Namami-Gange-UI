import { useState } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import TeamSectionHeader from './TeamSectionHeader'
import RoleCard from './RoleCard'
import CreateRoleModal from './CreateRoleModal'
import ConfirmModal from '../ui/ConfirmModal'
import { createRole, deleteRole, fetchRole, fetchRoles, updateRole, type TeamRole } from '../../api/roles'
import { teamRoles } from '../../data/mockData'

const PlusIcon = ico('fluent:add-24-filled')

export default function RoleManagementTab({ roles = teamRoles, onRolesChange, onViewUsers }) {
  const [localRoles, setLocalRoles] = useState(teamRoles)
  const roleList = onRolesChange ? roles : localRoles
  const setRoles = onRolesChange ?? setLocalRoles
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TeamRole | null>(null)
  const [pendingDelete, setPendingDelete] = useState<TeamRole | null>(null)
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const refreshRoles = async () => {
    const next = await fetchRoles()
    setRoles(next)
  }

  const saveRole = async (payload) => {
    if (editing) {
      await updateRole(editing.id, payload)
    } else {
      await createRole(payload)
    }
    await refreshRoles()
  }

  const openCreate = () => {
    setActionError('')
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = async (role: TeamRole) => {
    setActionError('')
    setBusy(true)
    try {
      setEditing(await fetchRole(role.id))
      setModalOpen(true)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to open this role.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader
        tab="Role Management"
        right={
          <Button onClick={openCreate} disabled={busy}>
            Create Role
            <PlusIcon size={16} />
          </Button>
        }
      />

      {actionError && (
        <p className="rounded-[10px] border border-[#F6C9CB] bg-danger-soft px-[14px] py-[10px] text-[13px] text-danger">
          {actionError}
        </p>
      )}

      <div className="grid grid-cols-3 gap-[16px]">
        {roleList.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => openEdit(role)}
            onDelete={() => {
              setActionError('')
              setPendingDelete(role)
            }}
            onViewUsers={() => onViewUsers?.(role.name)}
          />
        ))}
      </div>

      {roleList.length === 0 && (
        <p className="rounded-[12px] border border-line bg-white px-[16px] py-[22px] text-center text-[13px] text-ink-soft">
          No roles yet. Create a role to get started.
        </p>
      )}

      <CreateRoleModal
        open={modalOpen}
        role={editing}
        existingNames={roleList.map((r) => r.name)}
        onClose={closeModal}
        onSubmit={saveRole}
      />
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete Role"
        message={`Are you sure you want to delete ${pendingDelete?.name}? This cannot be undone.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (!pendingDelete) return
          try {
            await deleteRole(pendingDelete.id)
            await refreshRoles()
            setPendingDelete(null)
          } catch (error) {
            setActionError(error instanceof Error ? error.message : 'Unable to delete this role.')
            setPendingDelete(null)
          }
        }}
      />
    </div>
  )
}
