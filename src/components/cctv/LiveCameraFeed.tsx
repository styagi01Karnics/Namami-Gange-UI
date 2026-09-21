import CameraFeedTile from './CameraFeedTile'
import {
  getCameraSiteCode,
  getStreamUrl,
  isCameraOnline,
  type CctvCamera,
} from '../../api/cctv'

function cameraLocationLabel(camera: CctvCamera) {
  const name = String(camera.name ?? '').toLowerCase().replace(/\s+/g, '')
  if (camera.channel === 1 || /camera1|cam-?1\b/.test(name) || name.includes('influent')) return 'Influent'
  if (camera.channel === 2 || /camera2|cam-?2\b/.test(name) || name.includes('effluent')) return 'Effluent'
  return camera.name
}

function cameraToFeed(camera: CctvCamera) {
  const siteCode = getCameraSiteCode(camera)
  const online = isCameraOnline(camera)

  return {
    key: String(camera.id),
    cameraId: typeof camera.id === 'number' ? camera.id : undefined,
    id: camera.name,
    location: cameraLocationLabel(camera),
    lastSeen: online ? 'Live now' : 'Unavailable',
    status: online ? 'Live' : 'Offline',
    streamUrl: getStreamUrl(siteCode, camera.channel, camera),
    player: camera.player,
  }
}

export default function LiveCameraFeed({
  cameras = [],
  loading = false,
}: {
  cameras?: CctvCamera[]
  loading?: boolean
}) {
  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
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
