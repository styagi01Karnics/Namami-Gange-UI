import { useState } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import TeamSectionHeader from './TeamSectionHeader'
import RoleCard from './RoleCard'
import CreateRoleModal from './CreateRoleModal'
import ConfirmModal from '../ui/ConfirmModal'
import { teamRoles } from '../../data/mockData'

const PlusIcon = ico('fluent:add-24-filled')

export default function RoleManagementTab({ onViewUsers }) {
  const [roles, setRoles] = useState(teamRoles)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  const saveRole = (payload) => {
    if (editing) {
      setRoles((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...payload } : r)))
      return
    }

    setRoles((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        users: 0,
        createdOn: new Date().toLocaleDateString('en-GB'),
        ...payload,
      },
    ])
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader
        tab="Role Management"
        right={
          <Button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
          >
            Create Role
            <PlusIcon size={16} />
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-[16px]">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            onEdit={() => {
              setEditing(role)
              setModalOpen(true)
            }}
            onDelete={() => setPendingDelete(role)}
            onViewUsers={() => onViewUsers?.(role.name)}
          />
        ))}
      </div>

      <CreateRoleModal open={modalOpen} role={editing} onClose={closeModal} onSubmit={saveRole} />
      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete Role"
        message={`Are you sure you want to delete ${pendingDelete?.name}? This cannot be undone.`}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          setRoles((prev) => prev.filter((r) => r.id !== pendingDelete.id))
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
