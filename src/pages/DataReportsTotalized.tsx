import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ExportButtons from '@/components/ExportButtons'
import searchIcon from '@/assets/shared/icon-search.svg'
import chevronIcon from '@/assets/shared/icon-chevron-sm.svg'
import checkmarkIcon from '@/assets/shared/icon-checkmark.svg'

const rows = [
  {
    sno: '1',
    stp: '14 MLD STP, Sarai, Haridwar',
    vendor: 'Eco Smart Solutions Pvt .Ltd.',
    inlet: '892.00',
    outlet: '748.83',
    ts: '19 May 2026, 05:30 PM',
  },
  {
    sno: '2',
    stp: '68 MLD STP, Jagjeetpur, Haridwar',
    vendor: 'AAXIS NANO TECHNOLOGIES PVT  LTD',
    inlet: '1662.20',
    outlet: '2947.20',
    ts: '19 May 2026, 05:30 PM',
  },
  {
    sno: '3',
    stp: '14 MLD STP, Sarai, Haridwar',
    vendor: 'Eco Smart Solutions Pvt .Ltd.',
    inlet: '892.00',
    outlet: '748.83',
    ts: '19 May 2026, 05:30 PM',
  },
  {
    sno: '4',
    stp: '68 MLD STP, Jagjeetpur, Haridwar',
    vendor: 'AAXIS NANO TECHNOLOGIES PVT  LTD',
    inlet: '1662.20',
    outlet: '2947.20',
    ts: '19 May 2026, 05:30 PM',
  },
]

export default function DataReportsTotalized() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Data Reports' }, { label: 'Totalized' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex flex-col gap-[16px] px-[16px] pt-[22px]">
          <div className="flex items-center justify-end gap-[12px]">
            <ExportButtons />
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <button
              type="button"
              className="flex h-[36px] min-w-[280px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#7e7e7e]">Search STP</span>
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
              className="flex h-[36px] min-w-[220px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
            >
              <span className="text-[12px] font-[510] leading-[24px] text-[#07121e]">All Vendors</span>
              <span className="relative size-[16px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-1/2 h-[5.5px] w-[10px] -translate-x-1/2 -translate-y-1/2"
                  src={chevronIcon}
                />
              </span>
            </button>
            <label className="ml-auto flex items-center gap-[8px]">
              <span className="relative flex size-[18px] items-center justify-center rounded-[4px] bg-[#003c7a]">
                <img alt="" className="h-[9px] w-[12.25px]" src={checkmarkIcon} />
              </span>
              <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Influent</span>
            </label>
            <label className="flex items-center gap-[8px]">
              <span className="relative flex size-[18px] items-center justify-center rounded-[4px] border border-[#003c7a] bg-[#003c7a]">
                <img alt="" className="h-[9px] w-[12.25px]" src={checkmarkIcon} />
              </span>
              <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Effluent</span>
            </label>
          </div>
        </div>

        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {['S.No.', 'STP', 'Vendor', 'Inlet (m³/hr)', 'Outlet (m³/hr)', 'Timestamp'].map((h) => (
                  <th key={h} className="px-[16px] py-[16px] text-left text-[14px] font-[510] leading-[22px] text-[#7e7e7e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.sno} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.sno}</td>
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.stp}</td>
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] whitespace-pre text-[#07121e]">{row.vendor}</td>
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.inlet}</td>
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.outlet}</td>
                  <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
