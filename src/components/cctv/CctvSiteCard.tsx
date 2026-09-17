import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import IconToggle from '../ui/IconToggle'
import CameraTile from './CameraTile'

const PinIcon = ico('fluent:location-24-filled')

/** One STP with its cameras, collapsible like the panels on the STP page. */
export default function CctvSiteCard({ site, open, onToggle, onExpand }) {
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

        <IconToggle open={open} onClick={() => onToggle(site.stpId)} label={`Toggle ${site.name}`} />
      </div>

      {open && (
        <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
          {site.cameras.map((camera) => (
            <CameraTile key={camera.key} camera={camera} onExpand={onExpand} />
          ))}
        </div>
      )}
    </Card>
  )
}
