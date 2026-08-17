import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  DateRefreshBar,
  ParamChip,
  SearchExportBar,
  SortHeader,
  StatCard,
  StatusPill,
} from '@/components/ui'
import iconDoc from '@/assets/shared/icon-document-list.svg'
import iconDrop from '@/assets/stp-listing/icon-drop.svg'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'
import iconChevronUp from '@/assets/stp-listing/icon-chevron-up.svg'

const metricCards = [
  { label: 'Total Violations', icon: iconDoc, bg: '#ebf4fe' },
  { label: 'BOD Exceeded', icon: iconDrop, bg: '#f1f9f3' },
  { label: 'COD Exceeded', icon: iconDrop, bg: '#ebf4fe' },
  { label: 'TSS Exceeded', icon: iconDrop, bg: '#fbf6e8' },
  { label: 'PLC/SCADA Downtime', icon: iconDoc, bg: '#f5e7e7' },
  { label: 'OCEMS Downtime', icon: iconDoc, bg: '#edf3fd' },
]

const detailParams = [
  { name: 'pH', value: '7.48' },
  { name: 'BOD', value: '116.7 mg/L' },
  { name: 'COD', value: '238.15 mg/L' },
  { name: 'TSS', value: '214.34 mg/L' },
  { name: 'NH₄-N', value: '9.29 mg/L' },
  { name: 'Temp.', value: '36°C' },
  { name: 'N0₃-N', value: '9.29 mg/L' },
  { name: 'Flow', value: '9.29 mg/L' },
  { name: 'Phosphorus', value: '238.15 mg/L' },
  { name: 'TN', value: '214.34 mg/L' },
  { name: 'Totalizer', value: '7246.5 m³' },
]

const breachChips = [
  'BOD',
  'COD',
  'TSS',
  'pH',
  'Flow',
  'NH4-N',
  'NO3-N',
  'Totalizer',
  'TN',
  'Temp.',
  'Phosphorus',
]

export default function ViolationTracking() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Contract & Compliance' },
        { label: 'Violation Tracking', current: true },
      ]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {metricCards.map((card) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              iconBg={card.bg}
              label={card.label}
              value="26"
            />
          ))}
        </div>

        <Card className="overflow-hidden p-4">
          <SearchExportBar className="mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7f8fa]">
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    S.No.
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="STP" />
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="Parameter Breach" />
                  </th>
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    Downtime Duration
                  </th>
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    Downtime Period
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="Status" />
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="Severity" />
                  </th>
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eff0f6]">
                  <td colSpan={8} className="p-0">
                    <div className="grid grid-cols-[60px_1.3fr_1.8fr_1.1fr_1.2fr_0.9fr_0.9fr_70px] items-start px-3 py-4">
                      <span>1</span>
                      <span className="text-[14px] font-medium">
                        14 MLD STP, Sarai, Haridwar
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {breachChips.map((p) => (
                          <ParamChip key={p} label={p} active />
                        ))}
                      </div>
                      <span className="text-[14px]">10d 22h 7min</span>
                      <span className="text-[13px]">19 May 2026 - 19 May 2026</span>
                      <StatusPill label="Open" tone="orange" />
                      <StatusPill label="High" tone="red" />
                      <button type="button" className="flex justify-center">
                        <img src={iconChevronUp} alt="" className="size-5" />
                      </button>
                    </div>
                    <div className="mx-3 mb-4 grid grid-cols-2 gap-3 rounded-lg border border-[#eff0f6] bg-[#fafbfd] p-3 md:grid-cols-3 xl:grid-cols-6">
                      {detailParams.map((p) => (
                        <div
                          key={p.name}
                          className="rounded-lg border border-[#eff0f6] bg-white p-3"
                        >
                          <div
                            className="mb-2 flex size-8 items-center justify-center rounded bg-[#ebf4fe]"
                          >
                            <img src={iconDrop} alt="" className="h-4 w-[11px]" />
                          </div>
                          <p className="text-[14px] font-medium text-[#646464]">
                            {p.name}
                          </p>
                          <p className="text-[14px] font-semibold text-[#07121e]">
                            {p.value}
                          </p>
                          <span className="mt-1 inline-flex rounded-full bg-[#f4faff] px-2 py-0.5 text-[11px] text-[#0768d2]">
                            Limit exceeded
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
                {[
                  '68 MLD STP, Jagjeetpur, Haridwar',
                  '68 MLD STP, Jagjeetpur, Haridwar',
                  '68 MLD STP, Jagjeetpur, Haridwar',
                ].map((stp, i) => (
                  <tr key={i} className="border-b border-[#eff0f6]">
                    <td className="px-3 py-4">{i + 2}</td>
                    <td className="px-3 py-4 text-[14px] font-medium">{stp}</td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-1">
                        {breachChips.slice(0, 3).map((p) => (
                          <ParamChip key={p} label={p} active />
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[14px]">10d 22h 7min</td>
                    <td className="px-3 py-4 text-[13px]">
                      19 May 2026 - 19 May 2026
                    </td>
                    <td className="px-3 py-4">
                      <StatusPill label="Open" tone="orange" />
                    </td>
                    <td className="px-3 py-4">
                      <StatusPill label="High" tone="red" />
                    </td>
                    <td className="px-3 py-4 text-center">
                      <img src={iconChevron} alt="" className="mx-auto size-5" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
