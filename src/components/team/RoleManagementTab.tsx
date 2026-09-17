import { useState } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import TeamSectionHeader from './TeamSectionHeader'
import RoleCard from './RoleCard'
import CreateRoleModal from './CreateRoleModal'
import { teamRoles } from '../../data/mockData'

const PlusIcon = ico('fluent:add-24-filled')

export default function RoleManagementTab() {
  const [roles, setRoles] = useState(teamRoles)
  const [modalOpen, setModalOpen] = useState(false)

  const addRole = (role) =>
    setRoles((prev) => [
      ...prev,
      {
        id: `r-${Date.now()}`,
        users: 0,
        createdOn: new Date().toLocaleDateString('en-GB'),
        ...role,
      },
    ])

  return (
    <div className="flex flex-col gap-[16px]">
      <TeamSectionHeader
        tab="Role Management"
        right={
          <Button onClick={() => setModalOpen(true)}>
            Create Role
            <PlusIcon size={16} />
          </Button>
        }
      />

      <div className="grid grid-cols-3 gap-[16px]">
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} onDelete={() => setRoles((prev) => prev.filter((r) => r.id !== role.id))} />
        ))}
      </div>

      <CreateRoleModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addRole} />
    </div>
  )
}
