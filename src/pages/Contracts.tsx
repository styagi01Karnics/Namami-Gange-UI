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
import iconWallet from '@/assets/contracts/icon-wallet.svg'
import iconPdf from '@/assets/contracts/icon-pdf.svg'
import iconChevronUp from '@/assets/stp-listing/icon-chevron-up.svg'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'

export default function Contracts() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'Contract & Compliance' },
        { label: 'Contracts', current: true },
      ]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={iconDoc}
            iconBg="#ebf4fe"
            label="Total Contracts"
            value="26"
          />
          <StatCard
            icon={iconCheck}
            iconBg="#f1f9f3"
            label="Active Contracts"
            value="26"
            valueClassName="text-[#168e3f]"
          />
          <StatCard
            icon={iconDismiss}
            iconBg="#f5e7e7"
            label="Inactive Contracts"
            value="26"
            valueClassName="text-[#dc2626]"
          />
          <StatCard
            icon={iconWallet}
            iconBg="#fbf6e8"
            label="Total Contract Value"
            value="₹1245.80 CR"
            valueClassName="text-[#f69a30]"
            link="Across all contracts"
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
                    <SortHeader label="Contract Name" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Vendor" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Address" />
                  </th>
                  <th className="px-4 py-3">
                    <SortHeader label="Status" />
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-[14px] font-medium text-[#646464]">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eff0f6]">
                  <td colSpan={8} className="p-0">
                    <div className="grid grid-cols-[60px_1fr_1.2fr_1.4fr_1.3fr_1fr_1.2fr_70px] items-center px-4 py-4">
                      <span>1</span>
                      <span className="font-medium text-[#f69a30]">CN-001</span>
                      <span className="text-[14px] text-[#07121e]">
                        Haridwar STP Project
                      </span>
                      <span className="text-[14px] text-[#07121e]">
                        Eco Smart Solutions Pvt. Ltd.
                      </span>
                      <span className="text-[14px] text-[#07121e]">
                        Haridwar, Uttarakhand, 249401, India
                      </span>
                      <StatusPill label="Active" tone="green" />
                      <span className="text-[13px] text-[#07121e]">
                        19 May 2026 - 19 May 2027
                      </span>
                      <button type="button" className="flex justify-center">
                        <img src={iconChevronUp} alt="" className="size-5" />
                      </button>
                    </div>
                    <div className="mx-4 mb-4 grid grid-cols-3 gap-4 rounded-lg border border-[#eff0f6] bg-[#fafbfd] p-4 text-[13px]">
                      <div>
                        <p className="mb-2 font-semibold text-[#07121e]">
                          Agreement Details
                        </p>
                        <p className="text-[#646464]">
                          Description of contract scope and deliverables for STP
                          operations and maintenance.
                        </p>
                        <p className="mt-2 text-[#646464]">
                          Contract Value:{' '}
                          <span className="font-semibold text-[#07121e]">
                            ₹1,24,500
                          </span>
                        </p>
                        <p className="mt-1 text-[#646464]">
                          Security Deposit:{' '}
                          <span className="font-semibold text-[#07121e]">
                            ₹24,500 (5%)
                          </span>
                        </p>
                        <a
                          href="#"
                          className="mt-2 inline-flex items-center gap-2 text-[#0768d2]"
                        >
                          <img src={iconPdf} alt="" className="h-5 w-4" />
                          Agreement.pdf
                        </a>
                      </div>
                      <div>
                        <p className="mb-2 font-semibold text-[#07121e]">
                          Project Duration
                        </p>
                        <p className="text-[#646464]">
                          Original Duration:{' '}
                          <span className="text-[#07121e]">1 year</span>
                        </p>
                        <p className="mt-1 text-[#646464]">
                          Extended Duration:{' '}
                          <span className="text-[#07121e]">6 months</span>
                        </p>
                        <p className="mt-1 text-[#646464]">
                          Revised End Date:{' '}
                          <span className="text-[#07121e]">19 Nov 2027</span>
                        </p>
                      </div>
                      <div>
                        <p className="mb-2 font-semibold text-[#07121e]">
                          Contractor Information
                        </p>
                        <p className="text-[#646464]">
                          Contact Person:{' '}
                          <span className="text-[#07121e]">Mr. Ramesh Sharma</span>
                        </p>
                        <p className="mt-1 text-[#646464]">
                          Email:{' '}
                          <a href="mailto:ramesh@ecosmart.com" className="text-[#0768d2]">
                            ramesh@ecosmart.com
                          </a>
                        </p>
                        <p className="mt-1 text-[#646464]">
                          Phone:{' '}
                          <span className="text-[#07121e]">+91 98765 43210</span>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-[#eff0f6]">
                  <td className="px-4 py-4">2</td>
                  <td className="px-4 py-4 font-medium text-[#f69a30]">CN-002</td>
                  <td className="px-4 py-4 text-[14px]">Haridwar STP Project</td>
                  <td className="px-4 py-4 text-[14px]">
                    Eco Smart Solutions Pvt. Ltd.
                  </td>
                  <td className="px-4 py-4 text-[14px]">
                    Haridwar, Uttarakhand, 249401, India
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill label="Inactive" tone="gray" />
                  </td>
                  <td className="px-4 py-4 text-[13px]">
                    19 May 2026 - 19 May 2027
                  </td>
                  <td className="px-4 py-4 text-center">
                    <img src={iconChevron} alt="" className="mx-auto size-5" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
