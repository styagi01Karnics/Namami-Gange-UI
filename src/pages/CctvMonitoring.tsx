import { useEffect, useMemo, useState } from 'react'
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

function plantKey(item: { id?: string; plantCode?: string; stpId?: string }) {
  return [item.id, item.plantCode, item.stpId].map((value) => String(value ?? '').trim().toLowerCase())
}

function is14MldSarai(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '14mldsarai' || key === 'sarai-14')
}

function is68MldJagjeetpur(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '68mldjag' || key === 'jagjeetpur-68')
}

function pinCctvSiteOrder<T extends { id?: string; plantCode?: string; stpId?: string }>(items: T[]) {
  const first = items.find(is14MldSarai)
  const second = items.find(is68MldJagjeetpur)
  const rest = items.filter((item) => item !== first && item !== second)
  return [...(first ? [first] : []), ...(second ? [second] : []), ...rest]
}

export default function CctvMonitoring() {
  const [stpOptions, setStpOptions] = useState(() => toFilterPlantOptions([]))
  const [stpId, setStpId] = useState(ALL_STP_FILTER_OPTION.id)
  const [openIds, setOpenIds] = useState<string[]>(() =>
    toFilterPlantOptions([])
      .filter((option) => option.id !== ALL_STP_FILTER_OPTION.id)
      .map((option) => option.id),
  )
  const [expanded, setExpanded] = useState(null)
  const [liveByStp, setLiveByStp] = useState<Record<string, LiveSiteCamera[]>>({})


  const plantOptions = useMemo(
    () =>
      stpOptions.filter(
        (option): option is { id: string; label: string; plantCode?: string; stpId?: string } =>
          option.id !== ALL_STP_FILTER_OPTION.id,
      ),
    [stpOptions],
  )

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled) return
      const next = toFilterPlantOptions(plants)
      setStpOptions(next)
      setStpId((current) => (next.some((option) => option.id === current) ? current : ALL_STP_FILTER_OPTION.id))

      const allIds = next
        .filter((option) => option.id !== ALL_STP_FILTER_OPTION.id)
        .map((option) => option.id)
      setOpenIds(allIds)
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

    return pinCctvSiteOrder(options).map((option) => {
      const siteStpId = option.stpId || option.id
      const detail = resolveStpDetail({
        id: option.plantCode || option.id,
        label: option.label,
        plantCode: option.plantCode || option.id,
        stpId: siteStpId,
      } as PlantOption)
      const mockSite = cctvSites.find((site) => site.stpId === siteStpId)

      return {
        id: option.id,
        stpId: siteStpId,
        plantCode: option.plantCode || option.id,
        name: option.label,
        address: detail.address || mockSite?.address || '—',
        cameras: liveByStp[siteStpId] ?? mockSite?.cameras ?? emptyCameras(siteStpId),
      }
    })
  }, [stpId, plantOptions, liveByStp])

  const toggleSite = (id) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const allExpanded = sites.length > 0 && sites.every((site) => openIds.includes(site.id))

  const toggleAllSites = () => {
    if (allExpanded) {
      setOpenIds([])
      return
    }
    setOpenIds(sites.map((site) => site.id))
  }

  const selectStp = (id) => {
    setStpId(id)
    if (id === 'all') {
      setOpenIds(plantOptions.map((option) => option.id))
      return
    }
    setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
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
      <div className="flex items-center justify-end gap-[10px]">
        {expandAllButton}
        <Select
          options={stpOptions}
          value={stpId}
          onChange={selectStp}
          className="w-1/2"
          align="right"
        />
      </div>

      {sites.map((site) => (
        <CctvSiteCard
          key={site.id}
          site={site}
          open={openIds.includes(site.id)}
          onToggle={toggleSite}
          onExpand={(camera) =>
            setExpanded({
              camera,
              siteName: site.name,
              plantCode: site.plantCode,
              stpId: site.stpId,
            })
          }
        />
      ))}

      {expanded && (
        <CameraLightbox
          camera={expanded.camera}
          siteName={expanded.siteName}
          plantCode={expanded.plantCode}
          stpId={expanded.stpId}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  )
}
