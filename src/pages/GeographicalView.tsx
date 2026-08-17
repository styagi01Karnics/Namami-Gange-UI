import AppLayout from '@/layouts/AppLayout'
import {
  Card,
  ParamChip,
  SearchExportBar,
  StatCard,
  StatusPill,
} from '@/components/ui'
import iconDrop from '@/assets/stp-listing/icon-drop.svg'
import iconCheck from '@/assets/stp-listing/icon-check.svg'
import iconDismiss from '@/assets/stp-listing/icon-dismiss.svg'
import iconClock from '@/assets/stp-listing/icon-clock.svg'
import iconChevron from '@/assets/shared/icon-chevron-sm.svg'
import mapImg from '@/assets/geographical-view/map.png'
import pinGreen from '@/assets/geographical-view/pin-green.svg'
import pinRed from '@/assets/geographical-view/pin-red.svg'
import pinOrange from '@/assets/geographical-view/pin-orange.svg'
import lockIcon from '@/assets/geographical-view/lock.svg'
import zoomIn from '@/assets/geographical-view/zoom-in.svg'
import zoomOut from '@/assets/geographical-view/zoom-out.svg'

const params = ['BOD', 'COD', 'Flow', 'NH4-N', 'TSS', 'pH', 'NH2', 'Totalizer']

export default function GeographicalView() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'STP Monitoring' },
        { label: 'Geographical View', current: true },
      ]}
    >
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
          <SearchExportBar
            className="mb-4 justify-start"
            extra={
              <>
                <div className="relative flex h-[33px] w-[180px] items-center rounded border border-[#eff0f6] bg-white px-3">
                  <span className="text-[12px] font-medium text-[#646464]">
                    All States
                  </span>
                  <img
                    src={iconChevron}
                    alt=""
                    className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
                  />
                </div>
                <div className="relative flex h-[33px] w-[180px] items-center rounded border border-[#eff0f6] bg-white px-3">
                  <span className="text-[12px] font-medium text-[#646464]">
                    All STPs
                  </span>
                  <img
                    src={iconChevron}
                    alt=""
                    className="absolute right-3 top-1/2 size-4 -translate-y-1/2"
                  />
                </div>
              </>
            }
          />

          <div className="relative h-[420px] overflow-hidden rounded-lg">
            <img
              src={mapImg}
              alt="Geographical map"
              className="absolute inset-0 size-full object-cover"
            />
            <img
              src={pinGreen}
              alt=""
              className="absolute left-[42%] top-[38%] h-8 w-6"
            />
            <img
              src={pinRed}
              alt=""
              className="absolute left-[55%] top-[48%] h-8 w-6"
            />
            <img
              src={pinOrange}
              alt=""
              className="absolute left-[48%] top-[55%] h-8 w-6"
            />
            <div className="absolute left-[40%] top-[28%] rounded-lg bg-white px-3 py-2 shadow-md">
              <StatusPill label="Online" tone="green" />
              <p className="mt-1 text-[12px] font-medium text-[#07121e]">
                STP : 14 MLD STP, Sarai, Haridwar
              </p>
            </div>
            <button
              type="button"
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded bg-white shadow"
            >
              <img src={lockIcon} alt="" className="size-4" />
            </button>
            <div className="absolute bottom-3 right-3 flex flex-col gap-1">
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded bg-white shadow"
              >
                <img src={zoomIn} alt="" className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded bg-white shadow"
              >
                <img src={zoomOut} alt="" className="size-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-[#eff0f6] p-4">
            <div className="mb-3 flex items-center gap-3">
              <h2 className="text-[16px] font-semibold text-[#07121e]">
                STP : 14 MLD STP, Sarai, Haridwar
              </h2>
              <StatusPill label="Online" tone="green" />
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-2 text-[13px]">
                <p>
                  <span className="text-[#f69a30]">Inlet</span>
                  <span className="ml-2 text-[#07121e]">
                    19 May 2026, 05:30 PM
                  </span>
                </p>
                <p className="text-[#646464]">
                  Address:{' '}
                  <span className="text-[#07121e]">
                    Haridwar, Uttarakhand, 249401, India
                  </span>
                </p>
                <p className="text-[#646464]">
                  Vendor:{' '}
                  <span className="text-[#07121e]">
                    AAXIS NANO TECHNOLOGIES PVT LTD
                  </span>
                </p>
              </div>
              <div>
                <p className="mb-2 text-[14px] font-semibold text-[#07121e]">
                  Parameters
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {params.map((p) => (
                    <ParamChip key={p} label={p} />
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-[14px] font-semibold text-[#07121e]">
                  Offline reason
                </p>
                <div className="min-h-[80px] rounded-lg bg-[#edf3fd]/60 p-3 text-[12px] text-[#646464]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
