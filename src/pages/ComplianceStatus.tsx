import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  DateRefreshBar,
  ParamChip,
  SearchExportBar,
  SortHeader,
  StatusPill,
} from '@/components/ui'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'
import clsx from 'clsx'

const breachParams = [
  'BOD',
  'COD',
  'Flow',
  'NH4-N',
  'TSS',
  'pH',
  'NO3-N',
  'Totalizer',
  'TN',
  'Temp.',
  'Phosphorus',
]

const rows = [
  {
    no: 1,
    badge: 'Exceedance',
    badgeTone: 'orange' as const,
  },
  {
    no: 2,
    badge: 'Equipment Failure',
    badgeTone: 'red' as const,
  },
]

export default function ComplianceStatus() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Contract & Compliance' },
        { label: 'Compliance Status', current: true },
      ]}
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="h-9 rounded border border-[#0768d2] bg-[#edf3fd] px-4 text-[12px] font-medium text-[#0768d2]"
            >
              Based on Exceedance
            </button>
            <button
              type="button"
              className="h-9 rounded border border-[#eff0f6] bg-white px-4 text-[12px] font-medium text-[#646464]"
            >
              Based on Equipment Failure
            </button>
          </div>
          <DateRefreshBar />
        </div>
      }
    >
      <Card className="overflow-hidden p-4">
        <SearchExportBar
          className="mb-4"
          extra={
            <div className="relative flex h-[33px] w-[199px] items-center rounded border border-[#eff0f6] bg-white px-3">
              <span className="text-[12px] font-medium text-[#646464]">
                All States
              </span>
              <img
                src={iconChevron}
                alt=""
                className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
              />
            </div>
          }
        />
        <div className="flex gap-4">
          {/* Left map / location panel */}
          <div className="hidden w-[436px] shrink-0 rounded-lg bg-[#edf3fd]/40 p-4 lg:block">
            <div className="flex h-full min-h-[500px] flex-col items-center justify-center gap-4">
              <div className="flex gap-2">
                <span className="size-8 rounded bg-[#168e3f]/20" />
                <span className="size-8 rounded bg-[#dc2626]/20" />
              </div>
              <p className="text-center text-[13px] text-[#646464]">
                Location map panel
              </p>
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7f8fa]">
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    S.No.
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="STP" />
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="Address" />
                  </th>
                  <th className="px-3 py-3">
                    <SortHeader label="Parameter Breach" />
                  </th>
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    Exceedance
                  </th>
                  <th className="px-3 py-3 text-[14px] font-medium text-[#646464]">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.no} className="border-b border-[#eff0f6] align-top">
                    <td className="px-3 py-4 text-[14px]">{row.no}</td>
                    <td className="px-3 py-4">
                      <StatusPill label={row.badge} tone={row.badgeTone} />
                      <p className="mt-2 max-w-[120px] text-[14px] font-medium text-[#07121e]">
                        14 MLD STP, Sarai, Haridwar
                      </p>
                    </td>
                    <td className="px-3 py-4 text-[13px] text-[#07121e]">
                      Haridwar, Uttarakhand, 249401, India
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {breachParams.map((p, i) => (
                          <ParamChip key={p} label={p} active={i % 3 !== 2} />
                        ))}
                      </div>
                    </td>
                    <td
                      className={clsx(
                        'px-3 py-4 text-[14px] font-semibold',
                        'text-[#dc2626]',
                      )}
                    >
                      76.4%
                    </td>
                    <td className="px-3 py-4 text-[14px]">19 May 2026</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </AppLayout>
  )
}
