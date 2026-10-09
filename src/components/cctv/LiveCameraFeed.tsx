import CameraFeedTile from './CameraFeedTile'
import {
  cameraLocationLabel,
  getCameraSiteCode,
  getStreamUrl,
  hasCpvRecordings,
  isCameraOnline,
  type CctvCamera,
} from '../../api/cctv'

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
  stpId,
  plantCode,
}: {
  cameras?: CctvCamera[]
  loading?: boolean
  stpId?: string
  plantCode?: string
}) {
  const canRecord = hasCpvRecordings(stpId, plantCode)
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
            <CameraFeedTile
              key={camera.id}
              feed={cameraToFeed(camera)}
              divider={i % 2 === 1}
              recording={
                canRecord
                  ? {
                      plantCode,
                      stpId,
                      channel: camera.channel,
                      location: cameraLocationLabel(camera),
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}
