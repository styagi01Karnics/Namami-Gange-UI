import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'

/**
 * G1 note: Full frame 571:4695 blocked by Figma View-seat rate limit.
 * Uses shared dashboard chrome + STP identity from retrieved report screens.
 */
const metrics = [
  { label: 'Capacity', value: '68 MLD' },
  { label: 'Vendor', value: 'AAXIS NANO TECHNOLOGIES PVT LTD' },
  { label: 'Status', value: 'Online' },
  { label: 'Location', value: 'Jagjeetpur, Haridwar' },
  { label: 'Inlet Flow', value: '1662.20 m³/hr' },
  { label: 'Outlet Flow', value: '2947.20 m³/hr' },
]

export default function StpDetail() {
  return (
    <AppLayout breadcrumbs={[{ label: 'STP Detail' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex items-start justify-between px-[24px] pt-[24px]">
          <div>
            <h1 className="text-[18px] font-[590] text-[#07121e]">68 MLD STP, Jagjeetpur, Haridwar</h1>
            <p className="mt-[8px] text-[14px] font-[510] text-[#f69a30]">
              19 May 2026, 05:30 PM - 19 May 2026, 07:30 PM
            </p>
          </div>
          <div className="inline-flex h-[32px] items-center rounded-full bg-[#eaf3ec] px-[10px]">
            <span className="text-[14px] font-[590] text-[#168e3f]">Online</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[16px] p-[24px]">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-[10px] border border-[#d8edff] bg-white px-[16px] py-[16px]">
              <p className="text-[12px] font-[510] text-[#7e7e7e]">{m.label}</p>
              <p className="mt-[8px] text-[16px] font-[590] text-[#07121e]">{m.value}</p>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  )
}
