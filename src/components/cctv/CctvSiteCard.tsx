import { useState } from 'react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import IconToggle from '../ui/IconToggle'
import CameraTile from './CameraTile'
import RecordingPlaybackCard from './RecordingPlaybackCard'
import RecordingPlaybackModal, { type PlaybackFeed } from './RecordingPlaybackModal'
import {
  clipPeriod,
  currentRecordingPeriod,
  fetchRecordings,
  hasCpvRecordings,
  startPeriodPlayback,
  toPlaybackCameras,
  type LiveSiteCamera,
} from '../../api/cctv'

const PinIcon = ico('fluent:location-24-filled')

function channelOf(camera: LiveSiteCamera) {
  if (camera.channel) return camera.channel
  return String(camera.location ?? '').toLowerCase().includes('effluent') ? 2 : 1
}

/** One STP with its cameras, collapsible like the panels on the STP page. */
export default function CctvSiteCard({ site, open, onToggle, onExpand }) {
  const showRecordings = hasCpvRecordings(site.stpId, site.plantCode)
  const [playback, setPlayback] = useState<PlaybackFeed | null>(null)
  const [tileMessage, setTileMessage] = useState('')

  async function playLatestRecording(camera: LiveSiteCamera) {
    setTileMessage('')
    try {
      const channel = channelOf(camera)
      const listed = await fetchRecordings({
        plantCode: site.plantCode,
        stpId: site.stpId,
        channel,
      })
      const period = currentRecordingPeriod()
      const match =
        [...listed].reverse().find((clip) => clipPeriod(clip) === period) ?? listed[listed.length - 1]
      if (!match) {
        throw new Error('No recording files for this camera')
      }

      const clips = await startPeriodPlayback({
        plantCode: site.plantCode,
        stpId: site.stpId,
        channel,
        location: camera.location,
        date: match.startTime.slice(0, 10),
        period,
      })
      setPlayback({
        cameraId: camera.id,
        id: camera.id,
        location: camera.location,
        player: 'mp4',
        status: 'Recording',
        clips,
        streamUrl: clips[0].streamUrl,
      })
    } catch (error) {
      setTileMessage(error instanceof Error ? error.message : 'Unable to play recording')
    }
  }

  return (
    <Card className="p-[15px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold leading-5 text-brand">{site.name}</h3>
          <p className="mt-[7px] flex items-center gap-[6px] text-[12.5px] font-medium leading-4 text-orange">
            <PinIcon size={14} className="shrink-0" />
            {site.address}
          </p>
        </div>

        <IconToggle open={open} onClick={() => onToggle(site.id ?? site.stpId)} label={`Toggle ${site.name}`} />
      </div>

      {open && (
        <div className="mt-[14px] space-y-[14px]">
          <div className="grid grid-cols-2 gap-[14px]">
            {site.cameras.map((camera) => (
              <CameraTile
                key={camera.key}
                camera={camera}
                onExpand={onExpand}
                hideTags={showRecordings}
                onPlayRecording={showRecordings ? playLatestRecording : undefined}
                recording={
                  showRecordings
                    ? {
                        plantCode: site.plantCode,
                        stpId: site.stpId,
                        channel: channelOf(camera),
                        location: camera.location,
                      }
                    : undefined
                }
              />
            ))}
          </div>

          {tileMessage && <p className="text-[12.5px] font-medium text-danger">{tileMessage}</p>}

          {showRecordings && (
            <RecordingPlaybackCard
              cameras={toPlaybackCameras(site.cameras as LiveSiteCamera[])}
              stpId={site.stpId}
              plantCode={site.plantCode}
            />
          )}
        </div>
      )}

      {playback && <RecordingPlaybackModal feed={playback} onClose={() => setPlayback(null)} />}
    </Card>
  )
}
