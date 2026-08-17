import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ExportButtons from '@/components/ExportButtons'
import searchIcon from '@/assets/shared/icon-search.svg'
import checkmarkIcon from '@/assets/shared/icon-checkmark.svg'
import clockIcon from '@/assets/remote-calibration/icon-clock.svg'
import avatarRahul from '@/assets/remote-calibration/avatar-rahul.png'

const rows = [1, 2, 3].map((n) => ({
  id: String(n),
  sno: '1',
  certificate: '1',
  name: 'Rahul Sharma',
  date: '19 May 2026',
  status: 'Successful',
  analyzer: '19 May 2026',
  remarks: 'Technical standard violation + Plant downtime exceeded 4 hours',
  next: '19 May 2026',
}))

export default function RemoteCalibration() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Remote Calibration' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex flex-wrap items-center gap-[12px] px-[16px] pt-[22px]">
          <button
            type="button"
            className="flex h-[36px] min-w-[280px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Search STP</span>
            <span className="relative size-[16px] overflow-hidden">
              <img
                alt=""
                className="absolute top-1/2 left-[calc(50%-0.5px)] size-[13px] -translate-x-1/2 -translate-y-1/2"
                src={searchIcon}
              />
            </span>
          </button>
          <label className="flex items-center gap-[8px]">
            <span className="relative flex size-[18px] items-center justify-center rounded-[4px] bg-[#003c7a]">
              <img alt="" className="h-[9px] w-[12.25px]" src={checkmarkIcon} />
            </span>
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Influent</span>
          </label>
          <label className="flex items-center gap-[8px]">
            <span className="size-[18px] rounded-[4px] border border-[#003c7a]" />
            <span className="text-[12px] font-[510] leading-[24px] text-[#646464]">Effluent</span>
          </label>
          <div className="ml-auto">
            <ExportButtons />
          </div>
        </div>

        <div className="mt-[24px] flex items-start justify-between px-[16px]">
          <div>
            <h2 className="text-[16px] font-[590] leading-[22px] text-[#07121e]">
              STP : 14 MLD STP, Sarai, Haridwar
            </h2>
            <div className="mt-[12px] flex items-center gap-[8px]">
              <span className="relative size-[20px] overflow-hidden">
                <img
                  alt=""
                  className="absolute top-1/2 left-1/2 size-[15px] -translate-x-1/2 -translate-y-1/2"
                  src={clockIcon}
                />
              </span>
              <p className="text-[14px] font-[510] leading-[22px] text-[#f69a30]">
                19 May 2026, 05:30 PM - 19 May 2026, 07:30 PM{' '}
              </p>
            </div>
          </div>
          <div className="flex h-[32px] min-w-[32px] items-center justify-center rounded-full bg-[#eaf3ec] px-[6px]">
            <span className="text-[14px] font-[590] leading-[16px] text-[#168e3f]">Online</span>
          </div>
        </div>

        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {[
                  'S.No.',
                  'Certificate',
                  'Performed By',
                  'Calibration Date',
                  'Status',
                  'Analyzer',
                  'Remarks',
                  'Next Calibration',
                ].map((h) => (
                  <th key={h} className="px-[12px] py-[16px] text-left text-[14px] font-[510] leading-[22px] text-[#7e7e7e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border border-[#d8edff] bg-white">
                  <td className="px-[12px] py-[28px] text-center text-[14px] font-[510] text-[#07121e]">{row.sno}</td>
                  <td className="px-[12px] py-[28px] text-center text-[14px] font-[510] text-[#07121e]">
                    {row.certificate}
                  </td>
                  <td className="px-[12px] py-[28px]">
                    <div className="flex items-center gap-[8px]">
                      <img alt="" className="size-[32px] rounded-full object-cover" src={avatarRahul} />
                      <span className="text-[14px] font-[510] text-[#07121e]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-[12px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.date}</td>
                  <td className="px-[12px] py-[28px]">
                    <div className="inline-flex h-[32px] w-[100px] items-center justify-center rounded-full bg-[#eaf3ec] px-[6px]">
                      <span className="text-[14px] font-[590] leading-[16px] text-[#168e3f]">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-[12px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.analyzer}</td>
                  <td className="px-[12px] py-[28px]">
                    <div className="h-[96px] w-[206px] rounded-[4px] bg-[#f4faff] px-[12px] py-[12px]">
                      <p className="text-[14px] font-[510] leading-[24px] text-[#07121e]">{row.remarks}</p>
                    </div>
                  </td>
                  <td className="px-[12px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
