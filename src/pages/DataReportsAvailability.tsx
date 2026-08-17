import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ReportFilters from '@/components/ReportFilters'

const columns = [
  { key: 'ts', label: 'Timestamp', unit: '' },
  { key: 'bod', label: 'BOD', unit: '(mg/L)' },
  { key: 'cod', label: 'COD', unit: '(mg/L)' },
  { key: 'flow', label: 'Flow', unit: '(m³/hr)' },
  { key: 'nh4', label: 'NH₄-N', unit: '(mg/L)' },
  { key: 'tss', label: 'TSS', unit: '(mg/L)' },
  { key: 'ph', label: 'pH', unit: '' },
  { key: 'no3', label: 'NO₃-N', unit: '(mg/L)' },
  { key: 'tot', label: 'Totalizer', unit: '(m³)' },
  { key: 'tn', label: 'TN', unit: '' },
  { key: 'temp', label: 'Temp.', unit: '(mg/L)' },
  { key: 'phos', label: 'Phosphorus', unit: '' },
]

const rows = [
  {
    ts: ['05:30 PM', '19 May 2026'],
    values: [
      { v: '39.44%', red: true },
      { v: '-', red: false },
      { v: '39.44%', red: true },
      { v: '39.44%', red: true },
      { v: '-', red: false },
      { v: '-', red: false },
      { v: '39.44%', red: true },
      { v: '39.44%', red: true },
      { v: '39.44%', red: true },
      { v: '39.44%', red: true },
      { v: '39.44%', red: true },
    ],
  },
  {
    ts: ['05:30 PM', '20 May 2026'],
    values: [
      { v: '41.44%', red: true },
      { v: '-', red: false },
      { v: '41.44%', red: true },
      { v: '41.44%', red: true },
      { v: '-', red: false },
      { v: '-', red: false },
      { v: '41.44%', red: true },
      { v: '41.44%', red: true },
      { v: '41.44%', red: true },
      { v: '41.44%', red: true },
      { v: '41.44%', red: true },
    ],
  },
]

export default function DataReportsAvailability() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Data Reports' }, { label: 'Data Availability' }]}>
      <PageToolbar dateLabel="19 May 2026, 05:30 PM - 20 May 2026, 07:30 PM " />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <ReportFilters />
        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {columns.map((col) => (
                  <th key={col.key} className="px-[16px] py-[16px] text-left align-top">
                    <div className="text-[14px] font-[510] leading-[22px] text-[#7e7e7e]">{col.label}</div>
                    {col.unit ? (
                      <div className="text-[12px] font-[510] leading-[22px] text-[#646464]">{col.unit}</div>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] leading-[22px] text-[#07121e]">
                    <p>{row.ts[0]}</p>
                    <p>{row.ts[1]}</p>
                  </td>
                  {row.values.map((cell, j) => (
                    <td
                      key={j}
                      className={
                        cell.red
                          ? 'px-[16px] py-[24px] text-center text-[14px] font-[510] leading-[22px] text-[#dc2626]'
                          : 'px-[16px] py-[24px] text-center text-[14px] font-[510] leading-[22px] text-[#07121e]'
                      }
                    >
                      {cell.v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
