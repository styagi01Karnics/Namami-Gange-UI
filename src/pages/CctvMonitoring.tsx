import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsDownUp, ChevronsUpDown, Maximize2, Pause, Play, Radio, Video } from 'lucide-react'
import Select from '../components/ui/Select'
import CctvSiteCard from '../components/cctv/CctvSiteCard'
import CameraLightbox from '../components/cctv/CameraLightbox'
import { CameraStill } from '../components/cctv/CameraTile'
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
  const [view, setView] = useState<'carousel' | 'list'>('carousel')
  const [activeFeedIndex, setActiveFeedIndex] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const playerRef = useRef<HTMLDivElement>(null)


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
        id: option.id,
        stpId: siteStpId,
        name: option.label,
        address: detail.address || mockSite?.address || '—',
        cameras: liveByStp[siteStpId] ?? mockSite?.cameras ?? emptyCameras(siteStpId),
      }
    })
  }, [stpId, plantOptions, liveByStp])

  const liveFeeds = useMemo(
    () => sites.flatMap((site) => site.cameras
      .filter((camera) => camera.status === 'Live' && Boolean((camera as LiveSiteCamera).streamUrl))
      .map((camera) => ({ ...camera, siteName: site.name, siteId: site.id }))),
    [sites],
  )
  const activeFeed = liveFeeds[activeFeedIndex]

  useEffect(() => {
    setActiveFeedIndex(0)
  }, [stpId])

  useEffect(() => {
    if (!autoRotate || view !== 'carousel' || liveFeeds.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActiveFeedIndex((current) => (current + 1) % liveFeeds.length)
    }, 10000)
    return () => window.clearInterval(timer)
  }, [autoRotate, view, liveFeeds.length])

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
    setActiveFeedIndex(0)
    if (id !== 'all') setOpenIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  const showFeed = (index: number) => {
    setActiveFeedIndex((index + liveFeeds.length) % liveFeeds.length)
    setAutoRotate(false)
  }

  const toggleFullscreen = async () => {
    const player = playerRef.current
    if (!player) return
    if (document.fullscreenElement) await document.exitFullscreen().catch(() => {})
    else await player.requestFullscreen().catch(() => {})
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
    <div className="flex flex-col gap-[14px] pb-[22px]">
      <section className="overflow-hidden rounded-[16px] border border-[#DCE8F5] bg-white shadow-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EEF5] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[11px] bg-[#EAF4FF] text-[#0768D2]"><Video size={22} /></span>
            <div>
              <h1 className="text-[18px] font-bold leading-6 text-[#102653]">CCTV Monitoring</h1>
              <p className="text-[12px] font-medium text-[#7085A2]">Auto-rotating camera feeds across STPs</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              options={stpOptions}
              value={stpId}
              onChange={selectStp}
              className="w-[210px]"
              buttonClassName="!h-[36px] !rounded-[8px] !text-[12px]"
              align="right"
            />
            <div className="flex h-9 items-center rounded-[8px] border border-[#E3ECF6] bg-[#F5F9FE] p-[3px]">
              <button type="button" onClick={() => setView('carousel')} className={`h-[29px] rounded-[6px] px-3 text-[11px] font-semibold ${view === 'carousel' ? 'bg-[#0768D2] text-white shadow-sm' : 'text-[#536981]'}`}>Auto view</button>
              <button type="button" onClick={() => setView('list')} className={`h-[29px] rounded-[6px] px-3 text-[11px] font-semibold ${view === 'list' ? 'bg-[#0768D2] text-white shadow-sm' : 'text-[#536981]'}`}>Camera list</button>
            </div>
          </div>
        </header>

        {view === 'carousel' ? (
          <div className="grid grid-cols-1 gap-4 bg-[#F3F8FD] p-3 lg:grid-cols-[minmax(0,1fr)_280px] sm:p-4">
            <div className="min-w-0 overflow-hidden rounded-[13px] border border-[#D9E5F1] bg-[#111C29] shadow-sm">
              {activeFeed ? (
                <>
                  <div ref={playerRef} className="relative aspect-video w-full bg-[#101923]">
                    <CameraStill camera={activeFeed} sceneId={`carousel-${activeFeed.key}`} />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-0 top-0 z-[2] h-[34px] w-[248px] backdrop-blur-[7px]"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        WebkitMaskImage: 'linear-gradient(90deg, #000 0%, #000 72%, transparent 100%)',
                        maskImage: 'linear-gradient(90deg, #000 0%, #000 72%, transparent 100%)',
                      }}
                    />
                    <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen camera" className="absolute right-3 top-3 grid size-8 place-items-center rounded-[7px] bg-white/90 text-[#24384F] shadow hover:bg-white"><Maximize2 size={16} /></button>
                    <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 text-white">
                      <div>
                        <p className="text-[17px] font-bold leading-6 sm:text-[20px]">{activeFeed.siteName}</p>
                        <p className="mt-0.5 text-[12px] font-medium text-white/80">{activeFeed.location} Camera · {activeFeed.id}</p>
                      </div>
                      <span className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-medium">Stream {activeFeedIndex + 1} of {liveFeeds.length}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-3 py-2.5 sm:px-4">
                    <div className="flex items-center gap-2 text-[11px] text-[#60758D]">
                      <Radio size={15} className="text-[#16A765]" />
                      <span>{autoRotate ? 'Automatic rotation every 10 seconds' : 'Auto rotation paused'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => showFeed(activeFeedIndex - 1)} aria-label="Previous camera" className="grid size-8 place-items-center rounded-[7px] border border-[#DCE8F5] text-[#36516F] hover:bg-[#F3F8FD]"><ChevronLeft size={17} /></button>
                      <button type="button" onClick={() => setAutoRotate((enabled) => !enabled)} className="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0768D2] px-3 text-[11px] font-semibold text-white hover:bg-[#0556B2]">{autoRotate ? <Pause size={14} /> : <Play size={14} />}{autoRotate ? 'Pause' : 'Resume'}</button>
                      <button type="button" onClick={() => showFeed(activeFeedIndex + 1)} aria-label="Next camera" className="grid size-8 place-items-center rounded-[7px] border border-[#DCE8F5] text-[#36516F] hover:bg-[#F3F8FD]"><ChevronRight size={17} /></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex aspect-video flex-col items-center justify-center bg-[#172433] px-6 text-center text-white">
                  <Video size={34} className="text-white/55" />
                  <h2 className="mt-3 text-[16px] font-semibold">No camera streams available</h2>
                  <p className="mt-1 max-w-[420px] text-[12px] leading-5 text-white/65">Only cameras with an active status and configured stream are included here. Choose another STP or open Camera list to review all cameras.</p>
                </div>
              )}
            </div>

            <aside className="flex min-h-[250px] flex-col overflow-hidden rounded-[13px] border border-[#D9E5F1] bg-white">
              <div className="flex items-center justify-between border-b border-[#E9EFF6] px-3 py-3">
                <div>
                  <h2 className="text-[13px] font-bold text-[#243955]">Camera queue</h2>
                  <p className="mt-0.5 text-[10px] text-[#7A8DA3]">{liveFeeds.length} playable feeds</p>
                </div>
                <Radio size={17} className="text-[#16A765]" />
              </div>
              <div className="scroll-thin min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
                {liveFeeds.length ? liveFeeds.map((feed, index) => (
                  <button key={feed.key} type="button" onClick={() => showFeed(index)} className={`flex w-full items-center gap-2.5 rounded-[9px] p-2 text-left transition-colors ${index === activeFeedIndex ? 'bg-[#EAF4FF] ring-1 ring-[#B9D8FA]' : 'hover:bg-[#F6F9FC]'}`}>
                    <span className="grid size-8 shrink-0 place-items-center rounded-[8px] bg-[#EAF4FF] text-[#0768D2]"><Video size={16} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-semibold text-[#273B56]">{feed.siteName}</span>
                      <span className="mt-0.5 block text-[10px] text-[#71849B]">{feed.location}</span>
                    </span>
                    <span className="size-2 shrink-0 rounded-full bg-[#16B978]" />
                  </button>
                )) : <p className="px-2 py-4 text-center text-[11px] text-[#71849B]">No playable feeds for this selection.</p>}
              </div>
            </aside>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px] p-3 sm:p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] text-[#7085A2]">Browse every STP and camera. Offline or unconfigured cameras are shown in the site list but are excluded from auto-rotation.</p>
              {expandAllButton}
            </div>
            {sites.map((site) => (
              <CctvSiteCard
                key={site.id}
                site={site}
                open={openIds.includes(site.id)}
                onToggle={toggleSite}
                onExpand={(camera) => setExpanded({ camera, siteName: site.name })}
              />
            ))}
          </div>
        )}
      </section>

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
