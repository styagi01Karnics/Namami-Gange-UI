import AppLayout from '@/layouts/AppLayout'
import SettingsTabs from '@/components/SettingsTabs'
import searchIcon from '@/assets/shared/icon-search.svg'
import trashIcon from '@/assets/settings/icon-trash.svg'
import editIcon from '@/assets/settings/icon-edit.svg'
import addIcon from '@/assets/settings/icon-add.svg'

/**
 * G1 note: Full frame 585:5361 blocked by Figma View-seat rate limit.
 * Shell/tabs match Settings User Management (578:10369); table content uses
 * role labels present in that design until design context can be re-fetched.
 */
const roles = [
  { name: 'Super Admin', users: '12', color: '#014aff', perms: 'Full access' },
  { name: 'Admin', users: '8', color: '#fea420', perms: 'Manage users & reports' },
  { name: 'Content Manager', users: '5', color: '#1eaf61', perms: 'Edit content' },
  { name: 'Moderator', users: '3', color: '#9630fc', perms: 'Review & approve' },
]

export default function SettingsRoleManagement() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <SettingsTabs />
        <div className="mt-[16px] flex items-center gap-[12px] px-[16px]">
          <button
            type="button"
            className="flex h-[36px] min-w-[220px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Search role</span>
            <img alt="" className="size-[13px]" src={searchIcon} />
          </button>
          <button
            type="button"
            className="ml-auto flex h-[36px] items-center gap-[8px] rounded-[8px] border border-[rgba(7,104,210,0.4)] bg-white px-[14px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#0768d2]">Add new role</span>
            <img alt="" className="size-[12.5px]" src={addIcon} />
          </button>
        </div>
        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {['Role', 'Users', 'Permissions', 'Actions'].map((h) => (
                  <th key={h} className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.name} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[24px] text-[14px] font-[510]" style={{ color: role.color }}>
                    {role.name}
                  </td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{role.users}</td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{role.perms}</td>
                  <td className="px-[16px] py-[24px]">
                    <div className="flex items-center gap-[8px]">
                      <button
                        type="button"
                        className="rounded-[4px] border border-[rgba(220,38,38,0.4)] bg-[#fff4f4] p-[6px]"
                      >
                        <img alt="" className="h-[16.5px] w-[16px]" src={trashIcon} />
                      </button>
                      <button
                        type="button"
                        className="rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#f8fcff] p-[6px]"
                      >
                        <img alt="" className="size-[16px]" src={editIcon} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
