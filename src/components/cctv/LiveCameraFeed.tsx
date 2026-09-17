import CameraFeedTile from './CameraFeedTile'
import { cameraFeeds } from '../../data/mockData'

export default function LiveCameraFeed() {
  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Live Camera Feed</h3>

      <div className="mt-[14px] grid grid-cols-2 gap-[13px]">
        {cameraFeeds.map((feed, i) => (
          <CameraFeedTile key={feed.key} feed={feed} divider={i > 0} />
        ))}
      </div>
    </section>
  )
}
