import AppLayout from '@/layouts/AppLayout'
import { Card, DateRefreshBar } from '@/components/ui'
import iconCamera from '@/assets/dashboard/icon-camera.svg'
import iconOnline from '@/assets/cctv/icon-camera-online.svg'
import iconOffline from '@/assets/cctv/icon-camera-offline.svg'
import iconRecord from '@/assets/cctv/icon-record.svg'
import iconRecordStop from '@/assets/cctv/icon-record-stop.svg'
import cctvFeed from '@/assets/cctv/cctv-feed.png'

const cameraStats = [
  {
    label: 'Online Camera',
    value: '20',
    cardBg: 'bg-[#f4fff2]',
    iconBg: 'bg-[#eaf3ec]',
    valueClass: 'text-[#168e3f]',
    icon: iconOnline,
  },
  {
    label: 'Offline Camera',
    value: '20',
    cardBg: 'bg-[#fde8e8]',
    iconBg: 'bg-[#f5e7e7]',
    valueClass: 'text-[#dc2626]',
    icon: iconOffline,
  },
  {
    label: 'Recording',
    value: '18',
    cardBg: 'bg-[#ebf4fe]',
    iconBg: 'bg-[#d8edff]',
    valueClass: 'text-[#0768d2]',
    icon: iconRecord,
  },
  {
    label: 'Not Recording',
    value: '18',
    cardBg: 'bg-[#fbf6e8]',
    iconBg: 'bg-[#fff4d6]',
    valueClass: 'text-[#fdb93a]',
    icon: iconRecordStop,
  },
]

const recentAlerts = [
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
  { location: 'Main Gate', message: 'Motion Detected', time: '10:30 AM' },
]

function CameraStatBox({
  label,
  value,
  cardBg,
  iconBg,
  valueClass,
  icon,
}: (typeof cameraStats)[number]) {
  return (
    <div
      className={`flex h-[136px] w-[158px] flex-col items-center rounded-lg ${cardBg}`}
    >
      <div
        className={`mt-[18px] flex size-8 items-center justify-center rounded ${iconBg}`}
      >
        <img src={icon} alt="" className="size-5" />
      </div>
      <p className="mt-4 text-center text-[14px] font-medium leading-[22px] text-[#646464]">
        {label}
      </p>
      <p className={`text-[14px] font-semibold leading-[22px] ${valueClass}`}>
        {value}
      </p>
    </div>
  )
}

function CameraFeed({ label, timestamp }: { label: string; timestamp: string }) {
  return (
    <div className="relative h-[171px] overflow-hidden rounded-lg">
      <img src={cctvFeed} alt="" className="absolute inset-0 size-full object-cover" />
      <div className="absolute left-2 top-2 flex h-4 items-center gap-1.5 rounded bg-black/50 px-2">
        <span className="size-1.5 shrink-0 rounded-full bg-[#168e3f]" />
        <span className="text-[10px] font-medium leading-none text-white">{label}</span>
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        <span className="size-1.5 shrink-0 rounded-full bg-[#dc2626]" />
        <span className="text-[10px] font-medium leading-none text-white">{timestamp}</span>
      </div>
    </div>
  )
}

export default function CctvMonitoring() {
  return (
    <AppLayout
      breadcrumbs={[{ label: 'CCTV Monitoring', current: true }]}
      toolbar={<DateRefreshBar />}
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <Card className="relative h-[308px] w-[697px] shrink-0 overflow-hidden rounded-[10px]">
            <div className="absolute left-4 top-4">
              <div className="flex size-8 items-center justify-center rounded bg-[#ebf4fe] opacity-80">
                <img src={iconCamera} alt="" className="size-4" />
              </div>
              <p className="mt-2 text-[14px] font-medium leading-[22px] text-[#646464]">
                Total Camera
              </p>
              <p className="text-[16px] font-semibold leading-[22px] text-[#07121e]">24</p>
              <span className="mt-1 inline-flex h-5 items-center rounded-full bg-[#f4faff] px-1 text-[12px] font-medium text-[#0768d2] opacity-80">
                Across all area
              </span>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-[11px]">
              {cameraStats.map((stat) => (
                <CameraStatBox key={stat.label} {...stat} />
              ))}
            </div>
          </Card>

          <Card className="relative h-[308px] min-w-[422px] flex-1 overflow-hidden rounded-[10px]">
            <div className="flex items-start justify-between px-4 pt-4">
              <p className="text-[14px] font-medium leading-[22px] text-[#646464]">
                Recent Alerts
              </p>
              <button
                type="button"
                className="text-[14px] font-medium leading-[22px] text-[#0768d2] underline"
              >
                View all
              </button>
            </div>

            <div className="mt-6 px-4">
              {recentAlerts.map((alert, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between py-4">
                    <div className="flex gap-[15px]">
                      <span className="mt-0.5 size-3.5 shrink-0 rounded-full bg-[#dc2626]" />
                      <div>
                        <p className="text-[14px] font-medium leading-[17px] text-[#07121e]">
                          {alert.location}
                        </p>
                        <p className="mt-1.5 text-[12px] font-medium leading-[14px] text-[#646464]">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium leading-[14px] text-[#646464]">
                      {alert.time}
                    </span>
                  </div>
                  {index < recentAlerts.length - 1 && (
                    <div className="h-px bg-[rgba(70,78,95,0.08)]" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="h-[428px] overflow-hidden rounded-[10px] p-4">
          <p className="text-[14px] font-medium leading-[22px] text-[#646464]">
            Live Camera Feed
          </p>
          <div className="mt-[24px] grid grid-cols-3 gap-x-3 gap-y-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <CameraFeed key={index} label="Main Gate" timestamp="9:03:36:20" />
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}
