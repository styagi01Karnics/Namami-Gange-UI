import AppLayout from '@/layouts/AppLayout'
import avatar from '@/assets/dashboard/avatar.png'
import editIcon from '@/assets/settings/icon-edit.svg'

/**
 * G1 note: Full frame 578:10152 blocked by Figma View-seat rate limit.
 * Profile chrome matches Header persona (Rajesh Nair / Super Admin) from retrieved screens.
 */
export default function UserProfile() {
  return (
    <AppLayout breadcrumbs={[{ label: 'User Profile' }]}>
      <section className="overflow-hidden rounded-[12px] bg-white shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex items-start gap-[24px] px-[24px] py-[28px]">
          <img alt="" className="size-[96px] rounded-full object-cover" src={avatar} />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[20px] font-[590] text-[#07121e]">Rajesh Nair</h1>
                <p className="mt-[4px] text-[14px] font-[510] text-[#014aff]">Super Admin</p>
              </div>
              <button
                type="button"
                className="flex items-center gap-[8px] rounded-[8px] border border-[rgba(7,104,210,0.4)] bg-[#f8fcff] px-[12px] py-[8px]"
              >
                <img alt="" className="size-[16px]" src={editIcon} />
                <span className="text-[12px] font-[510] text-[#0768d2]">Edit profile</span>
              </button>
            </div>
            <div className="mt-[24px] grid grid-cols-2 gap-[16px]">
              {[
                { label: 'Email', value: 'rajeshnair1234@gmail.com' },
                { label: 'Phone', value: '+91 9856452310' },
                { label: 'User ID', value: '#1231456' },
                { label: 'Last seen', value: '15/02/2026 10:30 AM' },
              ].map((field) => (
                <div key={field.label} className="rounded-[8px] border border-[#d8edff] px-[16px] py-[14px]">
                  <p className="text-[12px] font-[510] text-[#7e7e7e]">{field.label}</p>
                  <p className="mt-[6px] text-[14px] font-[510] text-[#07121e]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  )
}
