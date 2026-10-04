import { useCallback, useEffect, useMemo, useState } from 'react'
import PrintDocument from '../components/export/PrintDocument'
import AuditLogsTab from '../components/team/AuditLogsTab'
import RoleManagementTab from '../components/team/RoleManagementTab'
import TeamTabs from '../components/team/TeamTabs'
import UserManagementTab from '../components/team/UserManagementTab'
import { fetchRoles, type TeamRole } from '../api/roles'
import { teamRoles, teamTabs } from '../data/mockData'

export default function TeamManagement() {
  const [tab, setTab] = useState(teamTabs[0])
  const [roles, setRoles] = useState<TeamRole[]>(teamRoles)
  const [userRoleFilter, setUserRoleFilter] = useState('All Roles')
  const [printDoc, setPrintDoc] = useState(null)

  const loadRoles = useCallback(() => {
    fetchRoles()
      .then((next) => {
        if (next.length > 0) setRoles(next)
      })
      .catch(() => {
        /* Keep mock roles if role-service is offline. */
      })
  }, [])

  useEffect(() => {
    loadRoles()
  }, [loadRoles, tab])

  const roleNames = useMemo(() => {
    const seen = new Set<string>()
    return roles
      .map((role) => role.name)
      .filter((name) => {
        if (!name || seen.has(name)) return false
        seen.add(name)
        return true
      })
  }, [roles])

  const roleNamesKey = roleNames.join('|')

  const exportPdf = (title, columns, rows) => setPrintDoc({ id: Date.now(), title, columns, rows })

  const viewRoleUsers = (roleName) => {
    setUserRoleFilter(roleName)
    setTab('User Management')
  }

  return (
    <div className="flex flex-col gap-[16px] pb-[22px]">
      <TeamTabs tabs={teamTabs} active={tab} onChange={setTab} />

      {tab === 'User Management' && (
        <UserManagementTab
          onExportPdf={exportPdf}
          roles={roles}
          roleNames={roleNames}
          roleNamesKey={roleNamesKey}
          roleFilter={userRoleFilter}
          onRoleFilterChange={setUserRoleFilter}
          onUsersChanged={loadRoles}
        />
      )}
      {tab === 'Role Management' && (
        <RoleManagementTab roles={roles} onRolesChange={setRoles} onViewUsers={viewRoleUsers} />
      )}
      {tab === 'Audit Logs' && <AuditLogsTab onExportPdf={exportPdf} />}

      {printDoc && (
        <PrintDocument
          key={printDoc.id}
          title={printDoc.title}
          columns={printDoc.columns}
          rows={printDoc.rows}
          onDone={() => setPrintDoc(null)}
        />
      )}
    </div>
  )
}
