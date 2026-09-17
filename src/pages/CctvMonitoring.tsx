import { useState } from 'react'
import Select from '../components/ui/Select'
import CctvSiteCard from '../components/cctv/CctvSiteCard'
import CameraLightbox from '../components/cctv/CameraLightbox'
import { cctvSites, cctvStpFilterOptions } from '../data/mockData'

export default function CctvMonitoring() {
  const [stpId, setStpId] = useState('all')
  const [openIds, setOpenIds] = useState([cctvSites[0].stpId])
  const [expanded, setExpanded] = useState(null)

  const sites = stpId === 'all' ? cctvSites : cctvSites.filter((s) => s.stpId === stpId)
  const toggleSite = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  // Picking a single STP should show its cameras straight away.
  const selectStp = (id) => {
    setStpId(id)
    if (id !== 'all') setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      <Select
        options={cctvStpFilterOptions}
        value={stpId}
        onChange={selectStp}
        className="w-1/2 self-end"
        align="right"
      />

      {sites.map((site) => (
        <CctvSiteCard
          key={site.stpId}
          site={site}
          open={openIds.includes(site.stpId)}
          onToggle={toggleSite}
          onExpand={(camera) => setExpanded({ camera, siteName: site.name })}
        />
      ))}

      {expanded && (
        <CameraLightbox
          camera={expanded.camera}
          siteName={expanded.siteName}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  )
}
