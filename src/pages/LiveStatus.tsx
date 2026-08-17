import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  DateRefreshBar,
  SearchExportBar,
  SortHeader,
  StatCard,
  StatusPill,
} from '@/components/ui'
import iconDrop from '@/assets/stp-listing/icon-drop.svg'
import iconCheck from '@/assets/stp-listing/icon-check.svg'
import iconDismiss from '@/assets/stp-listing/icon-dismiss.svg'
import iconClock from '@/assets/stp-listing/icon-clock.svg'

const rows = [
  {
    no: 1,
    stp: '14 MLD STP, Sarai, Haridwar',
  },
  {
    no: 2,
    stp: '68 MLD STP, Jagjeetpur, Haridwar',
  },
]

export default function LiveStatus() {
  return (
    <AppLayout title="Live Status" toolbar={<DateRefreshBar />}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={iconDrop} iconBg="#ebf4fe" label="Total STP's" value="26" />
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
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead>
                <tr className="bg-[#f7f8fa]">
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    S.No.
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="STP" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Address" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Site Location" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Status" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Current Status" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Timestamp" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.no} className="border-b border-[#eff0f6]">
                    <td className="px-4 py-4 text-[14px] text-[#07121e]">
                      {row.no}
                    </td>
                    <td className="px-4 py-4 text-[14px] font-medium text-[#07121e]">
                      {row.stp}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#07121e]">
                      Haridwar, Uttarakhand, 249401, India
                    </td>
                    <td className="px-4 py-4 text-[14px] font-medium text-[#f69a30]">
                      Inlet
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill label="Live" tone="green" />
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill label="Online" tone="green" />
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#07121e]">
                      19 May 2026, 05:30 PM
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
