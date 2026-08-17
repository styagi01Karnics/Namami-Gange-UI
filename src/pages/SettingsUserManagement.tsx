import { Link } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import SettingsTabs from '@/components/SettingsTabs'
import searchIcon from '@/assets/shared/icon-search.svg'
import chevronIcon from '@/assets/shared/icon-chevron-sm.svg'
import avatarPlaceholder from '@/assets/settings/avatar-placeholder.svg'
import trashIcon from '@/assets/settings/icon-trash.svg'
import editIcon from '@/assets/settings/icon-edit.svg'
import addIcon from '@/assets/settings/icon-add.svg'

const users = [
  {
    id: '#1231456',
    name: 'Rajesh Nair',
    phone: '9856452310',
    email: 'rajeshnair1234@gmail.com',
    role: 'Super Admin',
    roleColor: '#014aff',
    status: 'Active' as const,
    date: '15/02/2026',
    time: '10:30 AM',
  },
  {
    id: '#1231456',
    name: 'Rajesh Nair',
    phone: '9856452310',
    email: 'rajeshnair1234@gmail.com',
    role: 'Admin',
    roleColor: '#fea420',
    status: 'Inactive' as const,
    date: '15/02/2026',
    time: '10:30 AM',
  },
  {
    id: '#1231456',
    name: 'Rajesh Nair',
    phone: '9856452310',
    email: 'rajeshnair1234@gmail.com',
    role: 'Content Manager',
    roleColor: '#1eaf61',
    status: 'Active' as const,
    date: '15/02/2026',
    time: '10:30 AM',
  },
  {
    id: '#1231456',
    name: 'Rajesh Nair',
    phone: '9856452310',
    email: 'rajeshnair1234@gmail.com',
    role: 'Moderator',
    roleColor: '#9630fc',
    status: 'Active' as const,
    date: '15/02/2026',
    time: '10:30 AM',
  },
]

export default function SettingsUserManagement() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Settings' }]}>
      <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <SettingsTabs />

        <div className="mt-[16px] flex flex-wrap items-center gap-[12px] px-[16px]">
          <button
            type="button"
            className="flex h-[36px] min-w-[200px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">User ID</span>
            <span className="relative size-[16px] overflow-hidden">
              <img
                alt=""
                className="absolute top-1/2 left-[calc(50%-0.5px)] size-[13px] -translate-x-1/2 -translate-y-1/2"
                src={searchIcon}
              />
            </span>
          </button>
          <button
            type="button"
            className="flex h-[36px] min-w-[140px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Role</span>
            <img alt="" className="h-[5.5px] w-[10px]" src={chevronIcon} />
          </button>
          <button
            type="button"
            className="flex h-[36px] min-w-[140px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Status</span>
            <img alt="" className="h-[5.5px] w-[10px]" src={chevronIcon} />
          </button>
          <Link
            to="/settings/users"
            className="ml-auto flex h-[36px] items-center gap-[8px] rounded-[8px] border border-[rgba(7,104,210,0.4)] bg-white px-[14px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#0768d2]">Add new user</span>
            <span className="relative size-[16px] overflow-hidden">
              <img alt="" className="absolute top-1/2 left-1/2 size-[12.5px] -translate-x-1/2 -translate-y-1/2" src={addIcon} />
            </span>
          </Link>
        </div>

        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {['User ID', 'User', 'Email', 'Role', 'Status', 'Last seen on', 'Actions'].map((h) => (
                  <th key={h} className="px-[16px] py-[16px] text-left text-[14px] font-[510] leading-[22px] text-[#7e7e7e]">
                    <span className="inline-flex items-center gap-[4px]">
                      {h}
                      {h === 'Role' || h === 'Status' ? (
                        <img alt="" className="h-[5.5px] w-[10px]" src={chevronIcon} />
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={`${user.role}-${i}`} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#0d0e0f]">{user.id}</td>
                  <td className="px-[16px] py-[24px]">
                    <div className="flex items-center gap-[10px]">
                      <img alt="" className="size-[38px]" src={avatarPlaceholder} />
                      <div className="flex flex-col gap-[6px]">
                        <span className="text-[14px] font-[510] text-[#0d0e0f]">{user.name}</span>
                        <span className="text-[12px] font-[510] text-[#7e7e7e]">
                          +91 <span className="text-[#0d0e0f]">{user.phone}</span>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{user.email}</td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510]" style={{ color: user.roleColor }}>
                    {user.role}
                  </td>
                  <td className="px-[16px] py-[24px]">
                    <div
                      className={
                        user.status === 'Active'
                          ? 'inline-flex h-[32px] w-[77px] items-center justify-center rounded-full bg-[#eaf3ec] px-[6px]'
                          : 'inline-flex h-[32px] w-[77px] items-center justify-center rounded-full bg-[#e8e8e8] px-[6px]'
                      }
                    >
                      <span
                        className={
                          user.status === 'Active'
                            ? 'text-[14px] font-[590] leading-[16px] text-[#168e3f]'
                            : 'text-[14px] font-[590] leading-[16px] text-[#646464]'
                        }
                      >
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-[16px] py-[24px]">
                    <p className="text-[14px] font-[510] text-[#0d0e0f]">{user.date}</p>
                    <p className="text-[12px] font-[510] text-[#7e7e7e]">{user.time}</p>
                  </td>
                  <td className="px-[16px] py-[24px]">
                    <div className="flex items-center gap-[8px]">
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-[4px] border border-[rgba(220,38,38,0.4)] bg-[#fff4f4] p-[6px]"
                      >
                        <span className="relative size-[20px] overflow-hidden">
                          <img
                            alt=""
                            className="absolute top-1/2 left-1/2 h-[16.5px] w-[16px] -translate-x-1/2 -translate-y-1/2"
                            src={trashIcon}
                          />
                        </span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center rounded-[4px] border border-[rgba(7,104,210,0.4)] bg-[#f8fcff] p-[6px]"
                      >
                        <span className="relative size-[20px] overflow-hidden">
                          <img
                            alt=""
                            className="absolute top-1/2 left-1/2 size-[16px] -translate-x-1/2 -translate-y-1/2"
                            src={editIcon}
                          />
                        </span>
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
