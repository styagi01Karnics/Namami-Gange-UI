import CameraSummaryCard from './CameraSummaryCard'
import LiveCameraFeed from './LiveCameraFeed'
import CctvLogsCard from './CctvLogsCard'

/** Shared by the CCTV Monitoring page and the CCTV tab in STP Management. */
export default function CctvTab() {
  return (
    <div className="space-y-[14px]">
      <div className="grid grid-cols-[0.5fr_1fr] items-stretch gap-[14px] [&>*]:min-w-0">
        <CameraSummaryCard />
        <LiveCameraFeed />
      </div>

      <CctvLogsCard />
    </div>
  )
}
