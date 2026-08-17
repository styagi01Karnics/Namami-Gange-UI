import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  DateRefreshBar,
  SearchExportBar,
  SortHeader,
  StatCard,
  StatusPill,
} from '@/components/ui'
import iconDoc from '@/assets/shared/icon-document-list.svg'
import iconCheck from '@/assets/stp-listing/icon-check.svg'
import iconDismiss from '@/assets/stp-listing/icon-dismiss.svg'
import iconWallet from '@/assets/penalty-engine/icon-wallet.svg'
import iconEdit from '@/assets/penalty-engine/icon-edit.svg'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'

export default function PenaltyEngine() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Contract & Compliance' },
        { label: 'Penalty Engine', current: true },
      ]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={iconDoc} iconBg="#ebf4fe" label="Violations" value="10" />
          <StatCard
            icon={iconWallet}
            iconBg="#fbf6e8"
            label="Total Penalty Amount"
            value="₹45,000"
            valueClassName="text-[#f69a30]"
            link="Across all contracts"
          />
          <StatCard
            icon={iconCheck}
            iconBg="#f1f9f3"
            label="Penalties Recovered"
            value="₹25,000"
            valueClassName="text-[#168e3f]"
          />
          <StatCard
            icon={iconDismiss}
            iconBg="#f5e7e7"
            label="Pending Penalties"
            value="₹20,000"
            valueClassName="text-[#dc2626]"
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
                    <SortHeader label="Contract No." />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Vendor" />
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Violations
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Score
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Status" />
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Date
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2].map((no) => (
                  <tr key={no} className="border-b border-[#eff0f6]">
                    <td colSpan={9} className="p-0">
                      <div className="grid grid-cols-[60px_1fr_1.6fr_0.8fr_1fr_0.7fr_1fr_1.1fr_90px] items-center px-4 py-4">
                        <span>{no}</span>
                        <span className="font-medium text-[#f69a30]">CN-00{no}</span>
                        <span className="text-[14px]">Eco Smart Solutions Pvt .Ltd.</span>
                        <span>2</span>
                        <span className="font-semibold text-[#0768d2]">₹12,500</span>
                        <span>75</span>
                        <StatusPill label="Pending" tone="orange" />
                        <span className="text-[14px]">19 May 2026</span>
                        <div className="flex items-center gap-2">
                          <img
                            src={iconChevron}
                            alt=""
                            className={no === 1 ? 'size-4 rotate-180' : 'size-4'}
                          />
                          <img src={iconEdit} alt="" className="size-4" />
                        </div>
                      </div>
                      {no === 1 && (
                        <div className="mx-4 mb-4 grid grid-cols-2 gap-4 rounded-lg border border-[#eff0f6] bg-[#fafbfd] p-4">
                          <div className="text-[13px]">
                            <p className="mb-2 font-semibold text-[#07121e]">
                              Recovery Tracking
                            </p>
                            <p className="text-[#646464]">
                              Recovered Amount:{' '}
                              <span className="font-semibold text-[#168e3f]">
                                ₹10,500
                              </span>
                            </p>
                            <p className="mt-1 text-[#646464]">
                              Pending Amount:{' '}
                              <span className="font-semibold text-[#dc2626]">
                                ₹2,500
                              </span>
                            </p>
                            <p className="mt-1 text-[#646464]">
                              Recovery Mode:{' '}
                              <span className="text-[#07121e]">Bank Transfer</span>
                            </p>
                            <p className="mt-1 text-[#646464]">
                              Recovered By:{' '}
                              <span className="text-[#07121e]">Mr. Rakesh Gupta</span>
                            </p>
                          </div>
                          <div>
                            <p className="mb-2 font-semibold text-[#07121e]">
                              Penalty Message
                            </p>
                            <div className="rounded-lg bg-[#edf3fd] p-3 text-[13px] text-[#07121e]">
                              Technical standard violation + Plant downtime
                              exceeded 4 hours
                            </div>
                          </div>
                        </div>
                      )}
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
