import { useState } from 'react'
import PrintDocument from '../components/export/PrintDocument'
import AuditLogsTab from '../components/team/AuditLogsTab'
import RoleManagementTab from '../components/team/RoleManagementTab'
import TeamTabs from '../components/team/TeamTabs'
import UserManagementTab from '../components/team/UserManagementTab'
import { teamTabs } from '../data/mockData'

export default function TeamManagement() {
  const [tab, setTab] = useState(teamTabs[0])
  const [userRoleFilter, setUserRoleFilter] = useState('All Roles')
  const [printDoc, setPrintDoc] = useState(null)

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
          roleFilter={userRoleFilter}
          onRoleFilterChange={setUserRoleFilter}
        />
      )}
      {tab === 'Role Management' && <RoleManagementTab onViewUsers={viewRoleUsers} />}
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
