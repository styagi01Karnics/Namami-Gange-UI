import { useMemo, useState } from 'react'
import CameraTile from './CameraTile'
import CameraLightbox from './CameraLightbox'
import {
  hasCpvRecordings,
  isCameraOnline,
  type LiveSiteCamera,
} from '../../api/cctv'

export default function LiveCameraFeed({
  cameras = [],
  loading = false,
  stpId,
  plantCode,
  siteName,
}: {
  cameras?: LiveSiteCamera[]
  loading?: boolean
  stpId?: string
  plantCode?: string
  siteName?: string
}) {
  const [expandedCamera, setExpandedCamera] = useState<LiveSiteCamera | null>(null)
  const canRecord = hasCpvRecordings(stpId, plantCode)

  const sortedCameras = useMemo(() => {
    return [...cameras].sort((a, b) => {
      const aLive = a.status === 'Live' || isCameraOnline(a as any) ? 1 : 0
      const bLive = b.status === 'Live' || isCameraOnline(b as any) ? 1 : 0
      return bLive - aLive
    })
  }, [cameras])

  return (
    <section className="rounded-[12px] border border-line bg-white p-[15px] shadow-card">
      {loading ? (
        <p className="text-[13px] text-ink-soft">Loading cameras...</p>
      ) : sortedCameras.length === 0 ? (
        <p className="text-[13px] text-ink-soft">No cameras registered yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-[13px]">
          {sortedCameras.map((camera) => (
            <CameraTile
              key={camera.key}
              camera={camera}
              onExpand={setExpandedCamera}
              recording={
                canRecord
                  ? {
                      plantCode,
                      stpId,
                      channel:
                        camera.channel ||
                        (/mothorowala-20-2|20mldmoth_2|unit2/i.test(stpId ?? plantCode ?? '')
                          ? String(camera.location ?? '').toLowerCase().includes('effluent') ||
                            String(camera.location ?? '').toLowerCase().includes('treated')
                            ? 1
                            : 2
                          : String(camera.location ?? '').toLowerCase().includes('effluent') ||
                            String(camera.location ?? '').toLowerCase().includes('treated')
                            ? 2
                            : 1),
                      location: camera.location,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {expandedCamera && (
        <CameraLightbox
          camera={expandedCamera}
          siteName={siteName}
          plantCode={plantCode}
          stpId={stpId}
          onClose={() => setExpandedCamera(null)}
        />
      )}
    </section>
  )
}

