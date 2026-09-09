import CameraFeedTile from './CameraFeedTile'
import { getCameraSiteCode, getStreamUrl, isCameraOnline } from '../../api/cctv'

function cameraToFeed(camera) {
  const siteCode = getCameraSiteCode(camera)
  const online = isCameraOnline(camera)

  return {
    key: String(camera.id),
    cameraId: typeof camera.id === 'number' ? camera.id : undefined,
    id: camera.name,
    location: camera.siteCode ?? siteCode,
    lastSeen: online ? 'Live now' : 'Unavailable',
    status: online ? 'Live' : 'Offline',
    streamUrl: getStreamUrl(siteCode, camera.channel, camera),
    player: camera.player,
  }
}

export default function LiveCameraFeed({ cameras = [], loading = false }) {
  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px]">
      <h3 className="text-[15px] font-semibold leading-5 text-ink">Live Camera Feed</h3>

      {loading ? (
        <p className="mt-[14px] text-[13px] text-ink-soft">Loading cameras...</p>
      ) : cameras.length === 0 ? (
        <p className="mt-[14px] text-[13px] text-ink-soft">No cameras registered yet.</p>
      ) : (
        <div className="mt-[14px] grid grid-cols-2 gap-[13px]">
          {cameras.map((camera, i) => (
            <CameraFeedTile key={camera.id} feed={cameraToFeed(camera)} divider={i % 2 === 1} />
          ))}
        </div>
      )}
    </section>
  )
}
