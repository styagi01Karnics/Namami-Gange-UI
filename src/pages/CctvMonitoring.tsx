import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Columns,
  Expand,
  Maximize,
  Maximize2,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Play,
  Radio,
  Rows3,
  Search,
  Video,
  Waves,
} from 'lucide-react'
import Select from '../components/ui/Select'
import CctvSiteCard from '../components/cctv/CctvSiteCard'
import CameraLightbox from '../components/cctv/CameraLightbox'
import { CameraStill } from '../components/cctv/CameraTile'
import { cctvSites } from '../data/mockData'
import {
  emptyCameras,
  getCamerasForStp,
  hasCpvRecordings,
  isCameraOnline,
  loadLiveCamerasByStp,
  type LiveSiteCamera,
  type RecordingTarget,
} from '../api/cctv'
import {
  ALL_STP_FILTER_OPTION,
  fetchDashboardPlants,
  resolveStpDetail,
  toFilterPlantOptions,
  type PlantOption,
} from '../api/plants'

const AUTO_SWITCH_DURATION = 15

function plantKey(item: { id?: string; plantCode?: string; stpId?: string }) {
  return [item.id, item.plantCode, item.stpId].map((value) => String(value ?? '').trim().toLowerCase())
}

function is14MldSarai(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '14mldsarai' || key === 'sarai-14')
}

function is68MldJagjeetpur(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '68mldjag' || key === 'jagjeetpur-68')
}

function is33MldSaliar(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '33mldsali' || key === 'saliar-33')
}

function is20MldMothorowala(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '20mldmothorowala' || key === 'mothorowala-20')
}

function is20MldMothorowala2(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '20mldmoth_2' || key === 'mothorowala-20-2')
}

function is26MldRishikesh(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some(
    (key) => key === '26mldlkgt2' || key === 'lakkar-ghat-26' || key === '26mld' || key === 'rishikesh',
  )
}

function is10MldBazpur(item: { id?: string; plantCode?: string; stpId?: string }) {
  return plantKey(item).some((key) => key === '10mldbazpur' || key === 'bazpur-10' || key === 'bazpur')
}

const OFFICIAL_CCTV_ORDER_MAP: Record<string, number> = {
  '14mldsarai': 0,
  'sarai-14': 0,
  '14mld': 0,
  '68mldjag': 1,
  'jagjeetpur-68': 1,
  '68mld': 1,
  '27mldjag_upg': 2,
  'jagjeetpur-27-upg': 2,
  '18mldsarai_upg': 3,
  'sarai-18-upg': 3,
  '18mldjag': 4,
  'jagjeetpur-18': 4,
  '26mldlkgt2': 5,
  'lakkar-ghat-26': 5,
  '26mld': 5,
  '26mldlakkar': 5,
  '26mldrishikesh': 5,
  'rishikesh': 5,
  '20mldrishikesh': 5,
  '28mldindira': 6,
  'indira-nagar-28': 6,
  '20mldmothorowala': 7,
  'mothorowala-20': 7,
  '68mldkargi': 8,
  'kargi-68': 8,
  '20mldmoth_2': 9,
  'mothorowala-20-2': 9,
  '33mldsali': 10,
  'saliar-33': 10,
  '33mld_sal': 10,
  '10mldbazpur': 11,
  'bazpur-10': 11,
  'bazpur': 11,
  '10mld': 11,
  '10mldkashipur': 12,
  'kashipur-10': 12,
}

function officialOrderIndex(item: { id?: string; plantCode?: string; stpId?: string }) {
  const keys = plantKey(item)
  for (const k of keys) {
    if (k in OFFICIAL_CCTV_ORDER_MAP) return OFFICIAL_CCTV_ORDER_MAP[k]
  }
  return 999
}

function itemHasLiveStream(item: { id?: string; plantCode?: string; stpId?: string; cameras?: LiveSiteCamera[] }) {
  if (item.cameras && item.cameras.length > 0) {
    return item.cameras.some(
      (c) => (c.status === 'Live' || String(c.status).toUpperCase() === 'LIVE') && Boolean(c.streamUrl),
    )
  }
  const siteStpId = item.stpId || item.id
  const configured = getCamerasForStp(siteStpId) ?? getCamerasForStp(item.plantCode)
  return Boolean(configured?.some((c) => isCameraOnline(c) && Boolean(c.streamUrl || c.siteCode)))
}

function itemHasRecording(item: { id?: string; plantCode?: string; stpId?: string }) {
  const siteStpId = item.stpId || item.id
  return hasCpvRecordings(siteStpId, item.plantCode)
}

function cctvPriorityScore(item: { id?: string; plantCode?: string; stpId?: string; cameras?: LiveSiteCamera[] }) {
  const live = itemHasLiveStream(item)
  const recording = itemHasRecording(item)

  // STPs with live streaming or recording are prioritized on top
  if (live && recording) return 0
  if (live) return 1
  if (recording) return 2
  return 3
}

function pinCctvSiteOrder<T extends { id?: string; plantCode?: string; stpId?: string; cameras?: LiveSiteCamera[] }>(
  items: T[],
) {
  return [...items].sort((a, b) => {
    const priorityDiff = cctvPriorityScore(a) - cctvPriorityScore(b)
    if (priorityDiff !== 0) return priorityDiff
    return officialOrderIndex(a) - officialOrderIndex(b)
  })
}

/** Keep dropdown options with live streaming/recording plants on top. */
function pinFilterPlantOptions(
  options: Array<{ id: string; label: string; plantCode?: string; stpId?: string }>,
) {
  const allOption = options.find((option) => option.id === ALL_STP_FILTER_OPTION.id)
  const plants = options.filter((option) => option.id !== ALL_STP_FILTER_OPTION.id)
  return [...(allOption ? [allOption] : []), ...pinCctvSiteOrder(plants)]
}

function cameraChannel(camera: LiveSiteCamera, siteStpId?: string) {
  if (camera.channel) return camera.channel
  const is20Mld = /mothorowala|20mldmoth/i.test(siteStpId ?? '')
  const isEffluent = String(camera.location ?? '').toLowerCase().includes('effluent')
  if (is20Mld) {
    return isEffluent ? 1 : 2
  }
  return isEffluent ? 2 : 1
}

function recordingFor(
  site: { plantCode?: string; stpId?: string },
  camera: LiveSiteCamera,
): RecordingTarget | undefined {
  if (!hasCpvRecordings(site.stpId, site.plantCode)) return undefined
  return {
    plantCode: site.plantCode,
    stpId: site.stpId,
    channel: cameraChannel(camera, site.stpId || site.plantCode),
    location: camera.location,
  }
}

interface StpSite {
  id: string
  stpId: string
  plantCode?: string
  name: string
  address: string
  cameras: LiveSiteCamera[]
}

function getSiteStreams(site: StpSite) {
  const cameras = site.cameras || []

  let influent = cameras.find((c) => {
    const loc = String(c.location ?? c.id ?? '').toLowerCase()
    if (loc.includes('influent') || loc.includes('cam-in')) return true
    if (loc.includes('effluent') || loc.includes('cam-ef')) return false
    return c.channel === 1
  })
  if (!influent && cameras.length > 0) {
    influent = cameras[0]
  }

  let effluent = cameras.find((c) => {
    if (c === influent) return false
    const loc = String(c.location ?? c.id ?? '').toLowerCase()
    if (loc.includes('effluent') || loc.includes('cam-ef')) return true
    if (loc.includes('influent') || loc.includes('cam-in')) return false
    return c.channel === 2
  })
  if (!effluent && cameras.length > 1) {
    effluent = cameras[1]
  }

  const is20Mld = /mothorowala|20mldmoth/i.test(site.stpId)
  const defaultInfluentChannel = is20Mld ? 2 : 1
  const defaultEffluentChannel = is20Mld ? 1 : 2

  const fallbackInfluent: LiveSiteCamera = influent ?? {
    key: `${site.stpId}-influent`,
    id: 'Influent',
    location: 'Influent',
    status: 'Offline',
    lastActive: 'Unavailable',
    channel: defaultInfluentChannel,
  }

  const fallbackEffluent: LiveSiteCamera = effluent ?? {
    key: `${site.stpId}-effluent`,
    id: 'Effluent',
    location: 'Effluent',
    status: 'Offline',
    lastActive: 'Unavailable',
    channel: defaultEffluentChannel,
  }

  return { influent: fallbackInfluent, effluent: fallbackEffluent }
}

export default function CctvMonitoring() {
  const [stpOptions, setStpOptions] = useState(() => pinFilterPlantOptions(toFilterPlantOptions([])))
  const [stpId, setStpId] = useState<string>(ALL_STP_FILTER_OPTION.id)
  const [openIds, setOpenIds] = useState<string[]>(() =>
    pinFilterPlantOptions(toFilterPlantOptions([]))
      .filter((option) => option.id !== ALL_STP_FILTER_OPTION.id)
      .map((option) => option.id),
  )
  const [liveByStp, setLiveByStp] = useState<Record<string, LiveSiteCamera[]>>({})
  const [view, setView] = useState<'carousel' | 'list'>('carousel')
  const [cameraLayout, setCameraLayout] = useState<'parallel' | 'stacked'>('parallel')
  const [showQueue, setShowQueue] = useState(true)
  const [activeSiteIndex, setActiveSiteIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [remainingSeconds, setRemainingSeconds] = useState(AUTO_SWITCH_DURATION)
  const [isSwitching, setIsSwitching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expanded, setExpanded] = useState<{
    camera: LiveSiteCamera
    siteName: string
    plantCode?: string
    stpId?: string
  } | null>(null)

  const influentPlayerRef = useRef<HTMLDivElement>(null)
  const effluentPlayerRef = useRef<HTMLDivElement>(null)

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
      const next = pinFilterPlantOptions(toFilterPlantOptions(plants))
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
      const next = await loadLiveCamerasByStp(
        plantOptions,
        cctvSites as Array<{ stpId: string; cameras: LiveSiteCamera[] }>,
      )
      if (!cancelled) setLiveByStp(next)
    }

    if (plantOptions.length) loadLiveCameras()
    return () => {
      cancelled = true
    }
  }, [plantOptions])

  const allSites: StpSite[] = useMemo(() => {
    const rawSites: StpSite[] = plantOptions.map((option) => {
      const siteStpId = option.stpId || option.id
      const detail = resolveStpDetail({
        id: option.plantCode || option.id,
        label: option.label,
        plantCode: option.plantCode || option.id,
        stpId: siteStpId,
      } as PlantOption)
      const mockSite = cctvSites.find(
        (site) => site.stpId === siteStpId || site.stpId === option.plantCode || site.stpId === option.id,
      )

      return {
        id: option.id,
        stpId: siteStpId,
        plantCode: option.plantCode || option.id,
        name: option.label,
        address: detail.address || mockSite?.address || '—',
        cameras: liveByStp[siteStpId] ?? mockSite?.cameras ?? emptyCameras(siteStpId),
      }
    })

    return pinCctvSiteOrder(rawSites)
  }, [plantOptions, liveByStp])

  const sites = useMemo(() => {
    if (stpId === ALL_STP_FILTER_OPTION.id) {
      return allSites
    }
    const filtered = allSites.filter((site) => site.id === stpId || site.stpId === stpId)
    return filtered.length > 0 ? filtered : allSites
  }, [stpId, allSites])

  const filteredQueueSites = useMemo(() => {
    if (!searchQuery.trim()) return sites
    const q = searchQuery.toLowerCase().trim()
    return sites.filter(
      (site) => site.name.toLowerCase().includes(q) || site.address.toLowerCase().includes(q),
    )
  }, [sites, searchQuery])

  const safeIndex = sites.length > 0 ? Math.min(activeSiteIndex, sites.length - 1) : 0
  const activeSite = sites[safeIndex] ?? sites[0]

  const switchSite = (targetIndex: number) => {
    setIsSwitching(true)
    setActiveSiteIndex(targetIndex)
    setRemainingSeconds(AUTO_SWITCH_DURATION)
    const timeout = window.setTimeout(() => {
      setIsSwitching(false)
    }, 380)
    return () => window.clearTimeout(timeout)
  }

  // 15-second Auto Switch rotation timer (active on Auto view)
  useEffect(() => {
    if (!autoRotate || view !== 'carousel' || sites.length <= 1) {
      return undefined
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          const nextIndex = (activeSiteIndex + 1) % sites.length
          switchSite(nextIndex)
          return AUTO_SWITCH_DURATION
        }
        return prev - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [autoRotate, view, sites.length, activeSiteIndex])

  const handleSelectSite = (index: number) => {
    if (index === activeSiteIndex) return
    switchSite(index)
  }

  const handlePrevious = () => {
    if (sites.length <= 1) return
    const prevIndex = (activeSiteIndex - 1 + sites.length) % sites.length
    switchSite(prevIndex)
  }

  const handleNext = () => {
    if (sites.length <= 1) return
    const nextIndex = (activeSiteIndex + 1) % sites.length
    switchSite(nextIndex)
  }

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => {
      const next = !prev
      if (next) setRemainingSeconds(AUTO_SWITCH_DURATION)
      return next
    })
  }

  const toggleSite = (id: string) =>
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const allExpanded = sites.length > 0 && sites.every((site) => openIds.includes(site.id))

  const toggleAllSites = () => {
    if (allExpanded) {
      setOpenIds([])
      return
    }
    setOpenIds(sites.map((site) => site.id))
  }

  const handleFilterChange = (selectedId: string) => {
    setStpId(selectedId)
    if (selectedId === ALL_STP_FILTER_OPTION.id) {
      switchSite(0)
      setOpenIds(sites.map((site) => site.id))
    } else {
      const targetIndex = allSites.findIndex(
        (site) => site.id === selectedId || site.stpId === selectedId,
      )
      if (targetIndex >= 0) {
        switchSite(targetIndex)
      }
      setOpenIds((prev) => (prev.includes(selectedId) ? prev : [...prev, selectedId]))
    }
  }

  const toggleFullscreen = async (ref: React.RefObject<HTMLDivElement | null>) => {
    const el = ref.current
    if (!el) return
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => { })
    } else {
      await el.requestFullscreen().catch(() => { })
    }
  }

  const { influent, effluent } = useMemo(() => {
    if (!activeSite) {
      return {
        influent: emptyCameras('default')[0],
        effluent: emptyCameras('default')[1],
      }
    }
    return getSiteStreams(activeSite)
  }, [activeSite])

  const influentRecording = useMemo(() => {
    if (!activeSite) return undefined
    return recordingFor(activeSite, influent)
  }, [activeSite, influent])

  const effluentRecording = useMemo(() => {
    if (!activeSite) return undefined
    return recordingFor(activeSite, effluent)
  }, [activeSite, effluent])

  const influentIsLive = influent.status === 'Live' && Boolean(influent.streamUrl)
  const effluentIsLive = effluent.status === 'Live' && Boolean(effluent.streamUrl)

  const progressPercent = autoRotate
    ? Math.max(0, Math.min(100, ((AUTO_SWITCH_DURATION - remainingSeconds) / AUTO_SWITCH_DURATION) * 100))
    : 0

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
    <div className="flex flex-col gap-[14px] pb-[22px]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-[16px] border border-[#DCE8F5] bg-white shadow-card">
        {/* Header bar with View Toggle & STP Filter */}
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#E8EEF5] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[11px] bg-[#EAF4FF] text-[#0768D2]">
              <Video size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[18px] font-bold leading-6 text-[#102653]">CCTV Monitoring</h1>
              </div>
              <p className="text-[12px] font-medium text-[#7085A2]">
                {view === 'carousel'
                  ? 'Auto-rotating dual live streams across STPs every 15 seconds'
                  : 'Browse every STP and camera individually'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Plant Filter */}
            <Select
              options={stpOptions}
              value={stpId}
              onChange={handleFilterChange}
              className="w-[210px]"
              buttonClassName="!h-[36px] !rounded-[8px] !text-[12px]"
              align="right"
            />

            {/* View Switcher: Auto view vs Camera list */}
            <div className="flex h-9 items-center rounded-[8px] border border-[#E3ECF6] bg-[#F5F9FE] p-[3px]">
              <button
                type="button"
                onClick={() => setView('carousel')}
                className={`h-[29px] rounded-[6px] px-3 text-[11px] font-semibold transition-colors ${view === 'carousel' ? 'bg-[#0768D2] text-white shadow-sm' : 'text-[#536981] hover:text-[#102653]'
                  }`}
              >
                Auto view
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className={`h-[29px] rounded-[6px] px-3 text-[11px] font-semibold transition-colors ${view === 'list' ? 'bg-[#0768D2] text-white shadow-sm' : 'text-[#536981] hover:text-[#102653]'
                  }`}
              >
                Camera list
              </button>
            </div>
          </div>
        </header>

        {/* View 1: Auto view tab */}
        {view === 'carousel' ? (
          <div
            className={`grid grid-cols-1 gap-3.5 bg-[#F3F8FD] p-2.5 sm:p-3.5 transition-all ${showQueue
                ? 'lg:grid-cols-[minmax(0,1fr)_250px] xl:grid-cols-[minmax(0,1fr)_260px]'
                : 'grid-cols-1'
              }`}
          >
            {/* Left Column: Enlarged Camera Stream View */}
            <div className="flex min-w-0 flex-col gap-3">
              {/* Active STP Information Header + Display Controls */}
              {activeSite && (
                <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-[12px] border border-[#DCE8F5] bg-white px-3.5 py-2 shadow-xs">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-[#0768D2]" />
                    <h2 className="truncate text-[14.5px] font-bold text-[#102653]">{activeSite.name}</h2>
                    <span className="rounded-full bg-[#EAF4FF] px-2 py-0.5 text-[9.5px] font-bold text-[#0768D2]">
                      STP {safeIndex + 1} of {sites.length}
                    </span>
                    <span className="hidden sm:inline text-[11px] text-[#7085A2]">· {activeSite.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Layout switcher: Side-by-Side vs Large Rows */}
                    <div className="flex h-[28px] items-center rounded-[6px] border border-[#DCE8F5] bg-[#F1F6FC] p-[2px]">
                      <button
                        type="button"
                        onClick={() => setCameraLayout('parallel')}
                        title="Side-by-side parallel view"
                        className={`flex h-[22px] items-center gap-1 rounded-[4px] px-2 text-[10.5px] font-semibold transition-colors ${cameraLayout === 'parallel'
                            ? 'bg-[#0768D2] text-white shadow-xs'
                            : 'text-[#536981] hover:text-[#102653]'
                          }`}
                      >
                        <Columns size={12} />
                        <span>Side-by-Side</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCameraLayout('stacked')}
                        title="Full-width large stacked rows"
                        className={`flex h-[22px] items-center gap-1 rounded-[4px] px-2 text-[10.5px] font-semibold transition-colors ${cameraLayout === 'stacked'
                            ? 'bg-[#0768D2] text-white shadow-xs'
                            : 'text-[#536981] hover:text-[#102653]'
                          }`}
                      >
                        <Rows3 size={12} />
                        <span>Large Rows</span>
                      </button>
                    </div>

                    {/* Toggle Queue visibility to maximize camera size even further */}
                    <button
                      type="button"
                      onClick={() => setShowQueue((prev) => !prev)}
                      title={showQueue ? 'Hide queue to maximize cameras' : 'Show queue'}
                      className={`flex h-[28px] items-center gap-1 rounded-[6px] border px-2 text-[10.5px] font-semibold transition-colors ${!showQueue
                          ? 'border-[#0768D2] bg-[#EAF4FF] text-[#0768D2]'
                          : 'border-[#DCE8F5] bg-white text-[#536981] hover:bg-[#F3F8FD]'
                        }`}
                    >
                      {showQueue ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
                      <span className="hidden md:inline">{showQueue ? 'Hide Queue' : 'Show Queue'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Cameras Container: Resized to be larger and adaptable */}
              <div
                className={`grid gap-3 ${cameraLayout === 'parallel' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
                  }`}
              >
                {/* Influent Stream Card */}
                <div className="flex flex-col overflow-hidden rounded-[13px] border border-[#D9E5F1] bg-[#111C29] shadow-sm">
                  {/* Influent Header */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#162334] px-3.5 py-1.5 text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex items-center gap-1.5 rounded-full border border-[#0768D2]/50 bg-[#0768D2]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#93C5FD]">
                        <Waves size={12} className="text-[#60A5FA]" />
                        Influent (Sewage Water)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded({
                            camera: influent,
                            siteName: activeSite.name,
                            plantCode: activeSite.plantCode,
                            stpId: activeSite.stpId,
                          })
                        }
                        title="Half expand (Dialog view)"
                        aria-label="Half expand (Dialog view)"
                        className="grid size-6 place-items-center rounded-[5px] bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <Expand size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFullscreen(influentPlayerRef)}
                        title="Full expand (Fullscreen)"
                        aria-label="Full expand (Fullscreen)"
                        className="grid size-6 place-items-center rounded-[5px] bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <Maximize size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Influent Video Viewport - Resized Larger */}
                  <div
                    ref={influentPlayerRef}
                    className="relative aspect-video w-full bg-[#0E1724]"
                  >
                    <div
                      key={`${activeSite?.id ?? 'none'}-influent`}
                      className="relative h-full w-full animate-stream-fade"
                    >
                      <CameraStill
                        camera={influent}
                        sceneId={`parallel-${activeSite?.stpId ?? 'stp'}-influent`}
                        recording={influentRecording}
                      />
                    </div>

                    {isSwitching && (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#07121E]/60 backdrop-blur-[3px] transition-opacity duration-300">
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white shadow-lg backdrop-blur-md">
                          <span className="size-2 rounded-full bg-[#60A5FA] animate-ping" />
                          <span>Switching Influent...</span>
                        </div>
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 z-[2] h-[28px] w-[180px] backdrop-blur-[6px]"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)',
                        maskImage: 'linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)',
                      }}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-6 text-white">
                      <span className="rounded-full border border-white/20 bg-black/40 px-1.5 py-0.5 text-[9px] text-white/80">
                        Ch {cameraChannel(influent, activeSite?.stpId)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Effluent Stream Card */}
                <div className="flex flex-col overflow-hidden rounded-[13px] border border-[#D9E5F1] bg-[#111C29] shadow-sm">
                  {/* Effluent Header */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#162334] px-3.5 py-1.5 text-white">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex items-center gap-1.5 rounded-full border border-[#059669]/50 bg-[#059669]/30 px-2.5 py-0.5 text-[11px] font-semibold text-[#6EE7B7]">
                        <Waves size={12} className="text-[#34D399]" />
                        Effluent (Treated Water)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setExpanded({
                            camera: effluent,
                            siteName: activeSite.name,
                            plantCode: activeSite.plantCode,
                            stpId: activeSite.stpId,
                          })
                        }
                        title="Half expand (Dialog view)"
                        aria-label="Half expand (Dialog view)"
                        className="grid size-6 place-items-center rounded-[5px] bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <Expand size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleFullscreen(effluentPlayerRef)}
                        title="Full expand (Fullscreen)"
                        aria-label="Full expand (Fullscreen)"
                        className="grid size-6 place-items-center rounded-[5px] bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition-colors"
                      >
                        <Maximize size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Effluent Video Viewport - Resized Larger */}
                  <div
                    ref={effluentPlayerRef}
                    className="relative aspect-video w-full bg-[#0E1724]"
                  >
                    <div
                      key={`${activeSite?.id ?? 'none'}-effluent`}
                      className="relative h-full w-full animate-stream-fade"
                    >
                      <CameraStill
                        camera={effluent}
                        sceneId={`parallel-${activeSite?.stpId ?? 'stp'}-effluent`}
                        recording={effluentRecording}
                      />
                    </div>

                    {isSwitching && (
                      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#07121E]/60 backdrop-blur-[3px] transition-opacity duration-300">
                        <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium text-white shadow-lg backdrop-blur-md">
                          <span className="size-2 rounded-full bg-[#34D399] animate-ping" />
                          <span>Switching Effluent...</span>
                        </div>
                      </div>
                    )}

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 z-[2] h-[28px] w-[180px] backdrop-blur-[6px]"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)',
                        maskImage: 'linear-gradient(90deg, #000 0%, #000 70%, transparent 100%)',
                      }}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-6 text-white">
                      <span className="rounded-full border border-white/20 bg-black/40 px-1.5 py-0.5 text-[9px] text-white/80">
                        Ch {cameraChannel(effluent, activeSite?.stpId)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Toolbar: 15s Auto Switch & Prev/Next Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-[12px] border border-[#DCE8F5] bg-white px-3.5 py-2.5 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[12px] text-[#556981]">
                    <Radio size={15} className={autoRotate ? 'text-[#16A765] animate-pulse' : 'text-[#94A3B8]'} />
                    <span>
                      {autoRotate ? (
                        <>
                          Both cameras switch in <strong className="text-[#0768D2]">{remainingSeconds}s</strong>
                        </>
                      ) : (
                        'Auto rotation paused'
                      )}
                    </span>
                  </div>

                  {autoRotate && (
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#E2EDF8]">
                      <div
                        className="h-full bg-[#0768D2] transition-all duration-1000 ease-linear"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label="Previous STP"
                    title="Previous STP"
                    className="grid size-7 place-items-center rounded-[7px] border border-[#DCE8F5] bg-white text-[#36516F] transition-colors hover:bg-[#F3F8FD] active:scale-95"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={toggleAutoRotate}
                    className="inline-flex h-7 items-center gap-1.5 rounded-[7px] bg-[#0768D2] px-3 text-[11px] font-semibold text-white shadow-xs transition-all hover:bg-[#0556B2] active:scale-95"
                  >
                    {autoRotate ? <Pause size={13} /> : <Play size={13} />}
                    <span>{autoRotate ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next STP"
                    title="Next STP"
                    className="grid size-7 place-items-center rounded-[7px] border border-[#DCE8F5] bg-white text-[#36516F] transition-colors hover:bg-[#F3F8FD] active:scale-95"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Resized Slim STP Queue List */}
            {showQueue && (
              <aside
                className={`flex flex-col min-h-0 overflow-hidden rounded-[13px] border border-[#D9E5F1] bg-white shadow-xs ${cameraLayout === 'stacked'
                    ? 'max-h-[720px] lg:max-h-[calc(100vh-180px)]'
                    : 'max-h-[490px] xl:max-h-[530px]'
                  }`}
              >
                {/* Queue Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-[#E9EFF6] bg-[#FAFDFE] px-3 py-2.5">
                  <div>
                    <h2 className="text-[12.5px] font-bold text-[#102653]">Camera Queue</h2>
                    <p className="text-[10px] text-[#7A8DA3]">
                      {sites.length} STPs · 15s rotation
                    </p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-[#EAF4FF] px-1.5 py-0.5 text-[9.5px] font-bold text-[#0768D2]">
                    <Radio size={11} className="text-[#16A765]" />
                    15s
                  </span>
                </div>

                {/* Quick Filter Search inside Queue - Static header */}
                <div className="shrink-0 border-b border-[#EDF2F7] bg-white px-2.5 py-1.5">
                  <div className="relative">
                    <Search
                      size={13}
                      className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[#94A3B8]"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search queue..."
                      className="w-full rounded-[6px] border border-[#E2EBF5] bg-[#F8FAFC] py-1 pl-7 pr-2 text-[11px] text-[#243955] placeholder:text-[#94A3B8] focus:border-[#0768D2] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Scrollable list of STPs in Queue with visible scrollbar */}
                <div className="queue-scrollbar flex-1 min-h-0 space-y-1.5 overflow-y-auto overflow-x-hidden p-2 pr-1.5">
                  {filteredQueueSites.length > 0 ? (
                    filteredQueueSites.map((site) => {
                      const originalIndex = sites.findIndex((s) => s.id === site.id)
                      const isSelected = originalIndex === activeSiteIndex
                      const streams = getSiteStreams(site)
                      const hasLiveStream =
                        (streams.influent.status === 'Live' && Boolean(streams.influent.streamUrl)) ||
                        (streams.effluent.status === 'Live' && Boolean(streams.effluent.streamUrl))

                      return (
                        <button
                          key={site.id}
                          type="button"
                          onClick={() => handleSelectSite(originalIndex)}
                          className={`relative flex w-full flex-col overflow-hidden rounded-[8px] p-2 text-left transition-all ${isSelected
                              ? 'border-2 border-[#0768D2] bg-[#EBF4FE] shadow-xs'
                              : 'border border-[#E4EDF6] bg-white hover:border-[#BBD8F6] hover:bg-[#F9FBFE]'
                            }`}
                        >
                          {/* Top row: Plant name + Status pill */}
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`grid size-6 shrink-0 place-items-center rounded-[5px] text-[11px] font-bold ${isSelected
                                    ? 'bg-[#0768D2] text-white shadow-xs'
                                    : 'bg-[#EAF4FF] text-[#0768D2]'
                                  }`}
                              >
                                <Video size={12} />
                              </span>
                              <span className="truncate text-[11.5px] font-bold text-[#102653]">
                                {site.name}
                              </span>
                            </div>

                            {isSelected && (
                              <span className="shrink-0 rounded-full bg-[#0768D2] px-1.5 py-0.5 text-[8.5px] font-bold text-white shadow-xs">
                                NOW
                              </span>
                            )}
                          </div>

                          {/* Middle row: Address */}
                          <p className="mt-0.5 truncate pl-7 text-[10px] text-[#71849B]">
                            {site.address}
                          </p>

                          {/* Bottom row: Compact Stream Dots */}
                          <div className="mt-1.5 flex items-center justify-between border-t border-[#E8EFF6]/80 pt-1.5 text-[10px]">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 font-medium text-[#4B637F]">
                                <span
                                  className={`size-1.5 rounded-full ${streams.influent.status === 'Live' && streams.influent.streamUrl
                                      ? 'bg-[#16B978]'
                                      : hasCpvRecordings(site.stpId, site.plantCode)
                                        ? 'bg-[#F59E0B]'
                                        : 'bg-[#EF4444]'
                                    }`}
                                />
                                IN
                              </span>

                              <span className="inline-flex items-center gap-1 font-medium text-[#4B637F]">
                                <span
                                  className={`size-1.5 rounded-full ${streams.effluent.status === 'Live' && streams.effluent.streamUrl
                                      ? 'bg-[#16B978]'
                                      : hasCpvRecordings(site.stpId, site.plantCode)
                                        ? 'bg-[#F59E0B]'
                                        : 'bg-[#EF4444]'
                                    }`}
                                />
                                EF
                              </span>
                            </div>

                            <span
                              className={`text-[9.5px] font-semibold ${hasLiveStream ? 'text-[#16A765]' : 'text-[#7A8DA3]'
                                }`}
                            >
                              {hasLiveStream ? 'Live' : 'Offline'}
                            </span>
                          </div>

                          {/* 15s Timer Progress Bar across bottom of active card */}
                          {isSelected && autoRotate && (
                            <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#D4E6FA]">
                              <div
                                className="h-full bg-[#0768D2] transition-all duration-1000 ease-linear"
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                          )}
                        </button>
                      )
                    })
                  ) : (
                    <div className="py-6 text-center text-[11px] text-[#71849B]">
                      No matching plants found.
                    </div>
                  )}
                </div>
              </aside>
            )}
          </div>
        ) : (
          /* View 2: Camera list tab (original collapsible list) */
          <div className="flex max-h-[min(72vh,760px)] min-h-0 flex-col gap-[12px] overflow-hidden p-3 sm:p-4">
            <div className="flex shrink-0 items-center justify-between gap-3">
              <p className="text-[12px] text-[#7085A2]">
                Browse every STP and camera. STPs with active live streaming are shown on top, followed by
                offline plants.
              </p>
              {expandAllButton}
            </div>
            <div className="scroll-thin min-h-0 flex-1 space-y-[12px] overflow-y-scroll pr-1 [scrollbar-gutter:stable]">
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
            </div>
          </div>
        )}
      </section>

      {/* Lightbox Modal for Full Detail View */}
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
