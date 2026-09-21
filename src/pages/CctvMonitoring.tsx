import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronsDownUp, ChevronsUpDown } from 'lucide-react'
import Select from '../components/ui/Select'
import CctvSiteCard from '../components/cctv/CctvSiteCard'
import CameraLightbox from '../components/cctv/CameraLightbox'
import { cctvSites } from '../data/mockData'
import { emptyCameras, loadLiveCamerasByStp, type LiveSiteCamera } from '../api/cctv'
import {
  ALL_STP_FILTER_OPTION,
  fetchDashboardPlants,
  resolveStpDetail,
  toFilterPlantOptions,
  type PlantOption,
} from '../api/plants'

export default function CctvMonitoring() {
  const [stpOptions, setStpOptions] = useState(() => toFilterPlantOptions([]))
  const [stpId, setStpId] = useState(ALL_STP_FILTER_OPTION.id)
  const [openIds, setOpenIds] = useState<string[]>([])
  const [expanded, setExpanded] = useState(null)
  const [liveByStp, setLiveByStp] = useState<Record<string, LiveSiteCamera[]>>({})
  const [titleActionHost, setTitleActionHost] = useState<HTMLElement | null>(null)

  const plantOptions = useMemo(
    () =>
      stpOptions.filter(
        (option): option is { id: string; label: string; plantCode?: string; stpId?: string } =>
          option.id !== ALL_STP_FILTER_OPTION.id,
      ),
    [stpOptions],
  )

  useEffect(() => {
    setTitleActionHost(document.getElementById('page-title-action'))
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled) return
      const next = toFilterPlantOptions(plants)
      setStpOptions(next)
      setStpId((current) => (next.some((option) => option.id === current) ? current : ALL_STP_FILTER_OPTION.id))

      const firstStpId = next.find((option) => option.id !== ALL_STP_FILTER_OPTION.id)?.id
      if (firstStpId) {
        setOpenIds((prev) => (prev.length ? prev : [firstStpId]))
      }
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadLiveCameras() {
      const next = await loadLiveCamerasByStp(plantOptions, cctvSites as Array<{ stpId: string; cameras: LiveSiteCamera[] }>)
      if (!cancelled) setLiveByStp(next)
    }

    if (plantOptions.length) loadLiveCameras()
    return () => {
      cancelled = true
    }
  }, [plantOptions])

  const sites = useMemo(() => {
    const options = stpId === 'all' ? plantOptions : plantOptions.filter((option) => option.id === stpId)

    return options.map((option) => {
      const siteStpId = option.stpId || option.id
      const detail = resolveStpDetail({
        id: option.plantCode || option.id,
        label: option.label,
        plantCode: option.plantCode || option.id,
        stpId: siteStpId,
      } as PlantOption)
      const mockSite = cctvSites.find((site) => site.stpId === siteStpId)

      return {
        stpId: siteStpId,
        name: option.label,
        address: detail.address || mockSite?.address || '—',
        cameras: liveByStp[siteStpId] ?? mockSite?.cameras ?? emptyCameras(siteStpId),
      }
    })
  }, [stpId, plantOptions, liveByStp])

  const toggleSite = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const allExpanded = sites.length > 0 && sites.every((site) => openIds.includes(site.stpId))

  const toggleAllSites = () => {
    if (allExpanded) {
      setOpenIds([])
      return
    }
    setOpenIds(sites.map((site) => site.stpId))
  }

  const selectStp = (id) => {
    setStpId(id)
    if (id !== 'all') setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const expandAllButton = (
    <button
      type="button"
      onClick={toggleAllSites}
      aria-label={allExpanded ? 'Collapse all sites' : 'Expand all sites'}
      aria-expanded={allExpanded}
      title={allExpanded ? 'Collapse all' : 'Expand all'}
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] border border-[#D9E7FA] bg-[#EEF5FE] text-brand transition-colors hover:bg-brand-soft"
    >
      {allExpanded ? (
        <ChevronsDownUp size={17} strokeWidth={2.2} />
      ) : (
        <ChevronsUpDown size={17} strokeWidth={2.2} />
      )}
    </button>
  )

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      {titleActionHost && createPortal(expandAllButton, titleActionHost)}

      <Select
        options={stpOptions}
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
