import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  ParamChip,
  SearchExportBar,
  SortHeader,
  StatCard,
  StatusPill,
} from '@/components/ui'
import iconDrop from '@/assets/stp-listing/icon-drop.svg'
import iconCheck from '@/assets/stp-listing/icon-check.svg'
import iconDismiss from '@/assets/stp-listing/icon-dismiss.svg'
import iconClock from '@/assets/stp-listing/icon-clock.svg'
import iconChevronUp from '@/assets/stp-listing/icon-chevron-up.svg'

const params = [
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
    stp: '14 MLD STP, Sarai, Haridwar',
    state: 'Uttarakhand',
    site: 'Inlet',
    status: 'Online' as const,
    offlineReason: '',
  },
  {
    no: 2,
    stp: '14 MLD STP, Sarai, Haridwar',
    state: 'Uttarakhand',
    site: 'Outlet',
    status: 'Offline' as const,
    offlineReason:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
]

export default function StpListing() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'STP Monitoring' },
        { label: 'STP Listing', current: true },
      ]}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={iconDrop}
            iconBg="#ebf4fe"
            label="Total STP's"
            value="26"
          />
          <StatCard
            icon={iconCheck}
            iconBg="#f1f9f3"
            label="Online STP's"
            value="26"
            valueClassName="text-[#168e3f]"
          />
          <StatCard
            icon={iconDismiss}
            iconBg="#f5e7e7"
            label="Offline STP's"
            value="26"
            valueClassName="text-[#dc2626]"
          />
          <StatCard
            icon={iconClock}
            iconBg="#fbf6e8"
            label="Delay STP's"
            value="26"
            valueClassName="text-[#fdb93a]"
          />
        </div>

        <Card className="overflow-hidden p-4">
          <SearchExportBar className="mb-4" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7f8fa]">
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    S.No.
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="STP" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="State" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Site Location" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Status" />
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Timestamp
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Calibration" />
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.no} className="border-b border-[#eff0f6]">
                    <td colSpan={8} className="p-0">
                      <div className="grid grid-cols-[60px_1.4fr_1fr_1fr_1fr_1.2fr_1fr_80px] items-center px-4 py-4">
                        <span className="text-[14px] text-[#07121e]">{row.no}</span>
                        <span className="text-[14px] font-medium text-[#07121e]">
                          {row.stp}
                        </span>
                        <span className="text-[14px] text-[#07121e]">{row.state}</span>
                        <span className="text-[14px] font-medium text-[#f69a30]">
                          {row.site}
                        </span>
                        <StatusPill
                          label={row.status}
                          tone={row.status === 'Online' ? 'green' : 'red'}
                        />
                        <span className="text-[14px] text-[#07121e]">
                          19 May 2026, 05:30 PM
                        </span>
                        <span className="text-[14px] font-medium text-[#dc2626]">
                          No
                        </span>
                        <button type="button" className="flex justify-center">
                          <img src={iconChevronUp} alt="" className="size-5" />
                        </button>
                      </div>
                      <div className="mx-4 mb-4 grid grid-cols-3 gap-4 rounded-lg border border-[#eff0f6] bg-[#fafbfd] p-4">
                        <div>
                          <p className="mb-2 text-[14px] font-semibold text-[#07121e]">
                            STP Details
                          </p>
                          <p className="text-[12px] text-[#646464]">
                            Address:{' '}
                            <span className="text-[#07121e]">
                              Haridwar, Uttarakhand, 249401, India
                            </span>
                          </p>
                          <p className="mt-1 text-[12px] text-[#646464]">
                            Vendor:{' '}
                            <span className="text-[#07121e]">
                              AAXIS NANO TECHNOLOGIES PVT LTD
                            </span>
                          </p>
                          <p className="mt-1 text-[12px] text-[#646464]">
                            Prefix ID:{' '}
                            <span className="text-[#07121e]">STP-UK-014</span>
                          </p>
                        </div>
                        <div>
                          <p className="mb-2 text-[14px] font-semibold text-[#07121e]">
                            Parameter
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {params.map((p, i) => (
                              <ParamChip key={p} label={p} active={i < 6} />
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-[14px] font-semibold text-[#07121e]">
                            Offline reason
                          </p>
                          <div className="min-h-[80px] rounded-lg bg-[#edf3fd]/60 p-3 text-[12px] text-[#646464]">
                            {row.offlineReason}
                          </div>
                        </div>
                      </div>
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
