import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ReportFilters from '@/components/ReportFilters'

const rows = [
  { ts: '05:30 PM, 19 May 2026', param: 'BOD', value: '47.78', min: '0', max: '30', comment: 'Above max' },
  { ts: '05:30 PM, 19 May 2026', param: 'BOD', value: '47.78', min: '0', max: '30', comment: 'Above max' },
  { ts: '05:30 PM, 19 May 2026', param: 'BOD', value: '47.78', min: '0', max: '30', comment: 'Above max' },
]

export default function DataReportsExceedance() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Data Reports' }, { label: 'Exceedance' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <ReportFilters />
        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {['Timestamp', 'Parameter', 'Exceeding Value', 'Min.', 'Max.', 'Comment'].map((h) => (
                  <th key={h} className="px-[16px] py-[16px] text-left text-[14px] font-[510] leading-[22px] text-[#7e7e7e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[34px] text-[14px] font-[510] leading-[22px] text-[#07121e]">{row.ts}</td>
                  <td className="px-[16px] py-[34px] text-[14px] font-[510] leading-[22px] text-[#07121e]">{row.param}</td>
                  <td className="px-[16px] py-[34px] text-[14px] font-[590] leading-[22px] text-[#dc2626]">{row.value}</td>
                  <td className="px-[16px] py-[34px] text-[14px] font-[510] leading-[22px] text-[#07121e]">{row.min}</td>
                  <td className="px-[16px] py-[34px] text-[14px] font-[510] leading-[22px] text-[#07121e]">{row.max}</td>
                  <td className="px-[16px] py-[34px] text-[14px] font-[510] leading-[22px] text-[#07121e]">{row.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
