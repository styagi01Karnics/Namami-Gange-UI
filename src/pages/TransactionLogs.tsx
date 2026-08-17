import { Fragment, useState } from 'react'
import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ExportButtons from '@/components/ExportButtons'
import searchIcon from '@/assets/shared/icon-search.svg'
import chevronExpand from '@/assets/transaction-logs/icon-chevron-expand.svg'
import chevronIcon from '@/assets/shared/icon-chevron-sm.svg'
import calendarSm from '@/assets/transaction-logs/icon-calendar-sm.svg'

const rows = [
  {
    id: 'cc3fc334-1c94-4208-abc5-76b3b3054e0f',
    stp: '14 MLD STP, Sarai, Haridwar',
    uniqueId: '210MLD17555984235130475OUT',
    status: 'Pending',
    expanded: false,
  },
  {
    id: 'cc3fc334-1c94-4208-abc5-76b3b3054e0f-2',
    stp: '14 MLD STP, Sarai, Haridwar',
    uniqueId: '210MLD17555984235130475OUT',
    status: 'Pending',
    expanded: true,
    createdOn: '15/02/2026 ,10:30 AM',
    details: '{ "readings": [ { "bod": 23.78, "cod": 79.44, "tss": 24.53, "timestamp": "2026-07-28 15:38:00" } ] }',
  },
]

export default function TransactionLogs() {
  const [openId, setOpenId] = useState<string | null>(rows[1].id)

  return (
    <AppLayout breadcrumbs={[{ label: 'Transaction Logs' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex items-center justify-between gap-[12px] px-[16px] pt-[22px]">
          <button
            type="button"
            className="flex h-[36px] min-w-[320px] items-center justify-between gap-[12px] rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
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
          <ExportButtons />
        </div>

        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                <th className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">ID</th>
                <th className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">
                  <span className="inline-flex items-center gap-[4px]">
                    STP
                    <img alt="" className="h-[5.5px] w-[10px]" src={chevronIcon} />
                  </span>
                </th>
                <th className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">Unique ID</th>
                <th className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">Status</th>
                <th className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const open = openId === row.id
                return (
                  <Fragment key={row.id}>
                    <tr className="border border-[#d8edff] bg-white">
                      <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">
                        cc3fc334-1c94-4208-abc5-76b3b3054e0f
                      </td>
                      <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.stp}</td>
                      <td className="px-[16px] py-[28px] text-[14px] font-[510] text-[#07121e]">{row.uniqueId}</td>
                      <td className="px-[16px] py-[28px]">
                        <div className="inline-flex h-[32px] w-[77px] items-center justify-center rounded-full bg-[#fff3e5] px-[6px]">
                          <span className="text-[14px] font-semibold leading-[16px] text-[#ed7831]">{row.status}</span>
                        </div>
                      </td>
                      <td className="px-[16px] py-[28px]">
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : row.id)}
                          className="flex items-center justify-center rounded-[4px] bg-[#ebebeb] p-[6px]"
                        >
                          <img
                            alt=""
                            className={`h-[6.5px] w-[12px] ${open ? 'rotate-180' : ''}`}
                            src={chevronExpand}
                          />
                        </button>
                      </td>
                    </tr>
                    {open && row.details ? (
                      <tr className="border border-[#d8edff] bg-white">
                        <td colSpan={5} className="px-[16px] pb-[24px]">
                          <div className="rounded-[16px] border border-[#ebebeb] px-[16px] py-[16px]">
                            <div className="flex gap-[40px]">
                              <div>
                                <p className="text-[16px] font-[510] leading-[22px] text-[#646464]">Created On</p>
                                <div className="mt-[12px] flex items-center gap-[8px]">
                                  <img alt="" className="size-[16px]" src={calendarSm} />
                                  <p className="text-[14px] font-medium tracking-[-0.3px] text-[#10172a]">
                                    {row.createdOn}
                                  </p>
                                </div>
                              </div>
                              <div className="w-px self-stretch bg-[#ebebeb]" />
                              <div className="min-w-0 flex-1">
                                <p className="text-[16px] font-[510] leading-[22px] text-[#646464]">Details</p>
                                <p className="mt-[12px] text-[14px] font-medium tracking-[-0.3px] text-[#10172a]">
                                  {row.details}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
