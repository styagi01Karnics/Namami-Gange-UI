import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers3,
  Maximize2,
  Minimize2,
  Search,
} from 'lucide-react'
import L, { type LatLngExpression } from 'leaflet'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import Select from '../ui/Select'
import {
  stpDetails,
  type StpMapPoint,
  type StpMapRiskId,
} from '../../data/mockData'

const RISK_COLOR: Record<StpMapRiskId | 'nodata', string> = {
  normal: '#16A765',
  watch: '#E9B000',
  warning: '#F28C18',
  critical: '#E83F3F',
  nodata: '#AEB8C4',
}

const INITIAL_CENTER: LatLngExpression = [30.2, 78.25]
const INITIAL_ZOOM = 7
const ALL = 'all'
type MappedPlant = StpMapPoint & {
  city: string
  district: string
  operator: string
  detailCode?: string
  detailKey?: string
}

// The 13 approved plants are the only markers shown on this map. For the
// newer additions without surveyed GPS in the current dataset, the map uses
// approximate town coordinates until verified plant coordinates are provided.
const PLANT_POINTS: MappedPlant[] = [
  { id: 'map-sarai-14', label: '14 MLD STP, Sarai', lat: 29.8952, lng: 78.0893, risk: 'critical', riskPercent: 91, minZoom: 0, city: 'Haridwar', district: 'Haridwar', operator: 'UKPJN', detailCode: '14mldsarai', detailKey: 'sarai-14' },
  { id: 'map-jagjeetpur-68', label: '68 MLD STP, Haridwar', lat: 29.8987, lng: 78.139, risk: 'critical', riskPercent: 93, minZoom: 0, city: 'Haridwar', district: 'Haridwar', operator: 'UKPJN', detailCode: '68mldjag', detailKey: 'jagjeetpur-68' },
  { id: 'map-jagjeetpur-upgrade-27', label: '27 MLD STP, Jagjeetpur', lat: 29.8998, lng: 78.1377, risk: 'critical', riskPercent: 91, minZoom: 0, city: 'Haridwar', district: 'Haridwar', operator: 'UJS' },
  { id: 'map-sarai-upgrade-18', label: '18 MLD STP, Sarai', lat: 29.8933, lng: 78.0893, risk: 'critical', riskPercent: 91, minZoom: 0, city: 'Haridwar', district: 'Haridwar', operator: 'UJS' },
  { id: 'map-jagjeetpur-18', label: '18 MLD STP, Haridwar', lat: 29.9008, lng: 78.1384, risk: 'critical', riskPercent: 91, minZoom: 0, city: 'Haridwar', district: 'Haridwar', operator: 'UJS' },
  { id: 'map-lakkarghat-26', label: '26 MLD STP, Rishikesh', lat: 30.0577, lng: 78.2623, risk: 'watch', riskPercent: 69, minZoom: 0, city: 'Rishikesh', district: 'Dehradun', operator: 'UKPJN', detailCode: '26mldlkgt2', detailKey: 'lakkar-ghat-26' },
  { id: 'map-haldwani-28', label: '28 MLD STP, Haldwani', lat: 29.2183, lng: 79.513, risk: 'warning', riskPercent: 68, minZoom: 0, city: 'Haldwani', district: 'Nainital', operator: 'UKPJN' },
  { id: 'map-mothorowala-1-20', label: '20 MLD STP, Mothorowala-1', lat: 30.261902, lng: 78.042315, risk: 'watch', riskPercent: 65, minZoom: 0, city: 'Dehradun', district: 'Dehradun', operator: 'UJS', detailCode: '20mldmothorowala', detailKey: 'mothorowala-20' },
  { id: 'map-kargi-68', label: '68 MLD STP, Kargi Chowk', lat: 30.286472, lng: 78.016181, risk: 'normal', riskPercent: 31, minZoom: 0, city: 'Dehradun', district: 'Dehradun', operator: 'UJS', detailCode: '68mldkargi', detailKey: 'kargi-68' },
  { id: 'map-mothorowala-2-20', label: '20 MLD STP, Mothorowala-2', lat: 30.261347, lng: 78.041421, risk: 'watch', riskPercent: 70, minZoom: 0, city: 'Dehradun', district: 'Dehradun', operator: 'UJS', detailCode: '20mldmoth_2', detailKey: 'mothorowala-20-2' },
  { id: 'map-saliyar-33', label: '33 MLD STP, Saliyar, Roorkee', lat: 29.901612, lng: 77.864822, risk: 'normal', riskPercent: 20, minZoom: 0, city: 'Roorkee', district: 'Haridwar', operator: 'UJS', detailCode: '33mldsali', detailKey: 'saliar-33' },
  { id: 'map-bazpur-10', label: '10 MLD STP, Bazpur', lat: 29.152, lng: 79.11, risk: 'normal', riskPercent: 24, minZoom: 0, city: 'Bazpur', district: 'Udham Singh Nagar', operator: 'UKPJN' },
  { id: 'map-kashipur-10', label: '10 MLD STP, Kashipur', lat: 29.2104, lng: 78.9619, risk: 'watch', riskPercent: 42, minZoom: 0, city: 'Kashipur', district: 'Udham Singh Nagar', operator: 'UKPJN' },
]

const LABEL_LAYOUT: Record<string, { x: number; y: number }> = {
  // Individual callout lanes keep even nearby sites in separate rows.
  'map-mothorowala-1-20': { x: -100, y: -123 },
  'map-mothorowala-2-20': { x: -100, y: 37 },
  'map-kargi-68': { x: 100, y: -120 },
  'map-sarai-14': { x: -100, y: -121 },
  'map-sarai-upgrade-18': { x: -100, y: -41 },
  'map-jagjeetpur-68': { x: 100, y: -121 },
  'map-jagjeetpur-upgrade-27': { x: 100, y: -81 },
  'map-jagjeetpur-18': { x: 100, y: -41 },
  'map-lakkarghat-26': { x: 100, y: 3 },
  'map-bazpur-10': { x: 100, y: -39 },
  'map-kashipur-10': { x: -220, y: -33 },
  'map-haldwani-28': { x: -250, y: 8 },
  'map-saliyar-33': { x: -100, y: -81 },
}

const MAP_LABELS: Record<string, string> = {
  'map-sarai-14': '14 MLD Sarai',
  'map-jagjeetpur-68': '68 MLD Jagjeetpur',
  'map-jagjeetpur-upgrade-27': '27 MLD Jagjeetpur',
  'map-sarai-upgrade-18': '18 MLD Sarai',
  'map-jagjeetpur-18': '18 MLD Jagjeetpur',
  'map-lakkarghat-26': '26 MLD Lakkarghat',
  'map-haldwani-28': '28 MLD Indira Nagar',
  'map-mothorowala-1-20': '20 MLD Mothorowala-1',
  'map-kargi-68': '68 MLD Kargi Chowk',
  'map-mothorowala-2-20': '20 MLD Mothorowala-2',
  'map-saliyar-33': '33 MLD Saliyar',
  'map-bazpur-10': '10 MLD Bazpur',
  'map-kashipur-10': '10 MLD Kashipur',
}

function displayName(point: StpMapPoint) {
  return point.label.replace(/\s+STP(?:-\d+)?[,]?\s*/i, ' ').trim()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]!)
}

function plantLabelIcon(point: StpMapPoint) {
  const color = RISK_COLOR[point.risk]
  const offset = LABEL_LAYOUT[point.id] ?? { x: 100, y: 0 }
  const label = escapeHtml(MAP_LABELS[point.id] ?? displayName(point))
  const labelWidth = Math.max(84, Math.min(194, label.length * 6.2 + 18))
  const labelLeft = offset.x < 0 ? offset.x - labelWidth : offset.x
  const lineEndX = offset.x
  const labelTop = offset.y - 13
  const linePath = `M 11 11 H ${lineEndX + 11} V ${offset.y + 11}`
  return L.divIcon({
    className: 'stp-map-label-marker',
    html: `<div class="stp-map-callout" style="position:relative;width:22px;height:22px;overflow:visible;pointer-events:none;"><svg aria-hidden="true" style="position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none;"><path d="${linePath}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg><span class="stp-map-marker-dot" style="position:absolute;left:0;top:0;display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 1px 5px #172b4d66;color:#fff;font-size:10px;font-weight:700;pointer-events:auto;">●</span><button class="stp-map-callout-label" type="button" style="position:absolute;left:${labelLeft}px;top:${labelTop}px;width:${labelWidth}px;box-sizing:border-box;padding:4px 8px;border:1.5px solid ${color};border-radius:8px;background:#fff;box-shadow:0 2px 7px #172b4d30;color:#172b4d;font:600 11px/16px Inter,system-ui,sans-serif;white-space:nowrap;text-align:center;pointer-events:auto;cursor:pointer;">${label}</button></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

function MapInvalidateSize() {
  const map = useMap()
  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120)
    return () => window.clearTimeout(timer)
  }, [map])
  return null
}

function MapInitialBounds() {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLngBounds(PLANT_POINTS.map((point) => [point.lat, point.lng])).pad(0.08)
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
      map.invalidateSize()
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 7, animate: false })
      })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [map])
  return null
}

function MapFocus({ point }: { point: StpMapPoint | null }) {
  const map = useMap()
  useEffect(() => {
    if (point) map.flyTo([point.lat, point.lng], Math.min(Math.max(map.getZoom(), 10), 13), { duration: 0.7 })
  }, [map, point])
  return null
}

function MapPopupController({
  selectedId,
  markers,
}: {
  selectedId: string
  markers: Map<string, L.Marker>
}) {
  const map = useMap()
  useEffect(() => {
    markers.get(selectedId)?.openPopup()
  }, [map, markers, selectedId])
  return null
}

function MapPopupCloseReset({
  markers,
  onReset,
}: {
  markers: Map<string, L.Marker>
  onReset: () => void
}) {
  const map = useMap()
  useMapEvents({
    popupclose: () => {
      // Wait a tick so switching straight to another marker does not reset.
      window.setTimeout(() => {
        if ([...markers.values()].some((marker) => marker.isPopupOpen())) return
        onReset()
        const bounds = L.latLngBounds(PLANT_POINTS.map((point) => [point.lat, point.lng])).pad(0.08)
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 7, duration: 0.7 })
      }, 0)
    },
  })
  return null
}

function StpPopup({ point, onViewDetails }: { point: MappedPlant; onViewDetails: () => void }) {
  const detail = point.detailKey ? stpDetails[point.detailKey] : undefined
  const capacity = point.label.match(/[\d.]+\s*MLD/i)?.[0] ?? '—'
  const statusLabel = detail?.status ?? (point.risk === 'normal' ? 'Normal' : point.risk[0].toUpperCase() + point.risk.slice(1))
  const fields = [
    ['Capacity', capacity],
    ['Latitude / Longitude', `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`],
    ['STP In-charge', detail?.inCharge?.name ?? '—'],
    ['Vendor / Operator', detail?.vendor?.name ?? '—'],
    ['Compliance', 'No live data'],
  ]

  return (
    <div className="w-[238px] font-sans text-[#172B4D] [&_p]:!m-0">
      <div className="flex items-start justify-between gap-2 border-b border-[#E5ECF4] pb-1.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-[12px] font-bold leading-[16px]">{point.label}</p>
          <p className="text-[11px] text-[#77869A]">Code: {point.operator}</p>
        </div>
        <span className="shrink-0 rounded-full px-1.5 py-0.5 text-[11px] font-semibold" style={{ background: `${RISK_COLOR[point.risk]}18`, color: RISK_COLOR[point.risk] }}>
          {statusLabel}
        </span>
      </div>
      <p className="mt-1.5 text-[11px] leading-[15px] text-[#617186]">{detail?.address ?? `${point.city}, ${point.district}, Uttarakhand (address not available)`}</p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-2.5 gap-y-1.5">
        {fields.map(([label, value]) => (
          <div key={label} className="flex min-w-0 flex-col gap-0.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8996A7]">{label}</p>
            <p className="break-words text-[11px] font-semibold leading-[14px] text-[#26374D]">{value}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onViewDetails}
        className="mt-2 flex h-[32px] w-full items-center justify-center gap-1 rounded-[7px] bg-[#0768D2] px-3 text-[12px] font-semibold text-white transition-colors hover:bg-[#0556B2]"
      >
        View Details <span aria-hidden="true">→</span>
      </button>
    </div>
  )
}

export default function StpLocationsGISMapCard() {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const markerRefs = useRef(new Map<string, L.Marker>())
  const [stateId, setStateId] = useState(ALL)
  const [districtId, setDistrictId] = useState(ALL)
  const [cityId, setCityId] = useState(ALL)
  const [stpId, setStpId] = useState(ALL)
  const [search, setSearch] = useState('')
  const [focusPoint, setFocusPoint] = useState<StpMapPoint | null>(null)
  const [satellite, setSatellite] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === containerRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const stateOptions = useMemo(() => [
    { id: ALL, label: 'All States' },
    { id: 'uttarakhand', label: 'Uttarakhand' },
  ], [])
  const districtOptions = useMemo(() => [
    { id: ALL, label: 'All Districts' },
    ...[...new Set(PLANT_POINTS.map((point) => point.district))].map((district) => ({ id: district, label: district })),
  ], [])
  const cityOptions = useMemo(() => [
    { id: ALL, label: 'All Cities' },
    ...[...new Set(PLANT_POINTS
      .filter((point) => districtId === ALL || point.district === districtId)
      .map((point) => point.city))]
      .map((city) => ({ id: city, label: city })),
  ], [districtId])

  const scopedPoints = useMemo(() => PLANT_POINTS.filter((point) => {
    return (stateId === ALL || stateId === 'uttarakhand')
      && (districtId === ALL || point.district === districtId)
      && (cityId === ALL || point.city === cityId)
  }), [stateId, districtId, cityId])

  const stpOptions = useMemo(() => [
    { id: ALL, label: 'All STPs' },
    ...scopedPoints.map((point) => ({ id: point.id, label: displayName(point) })),
  ], [scopedPoints])

  const visiblePoints = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    return scopedPoints.filter((point) =>
      (stpId === ALL || point.id === stpId)
      && (!query || displayName(point).toLocaleLowerCase().includes(query)),
    )
  }, [scopedPoints, stpId, search])

  const handleStateChange = (next: string) => {
    setStateId(next)
    setDistrictId(ALL)
    setCityId(ALL)
    setStpId(ALL)
  }

  const handleDistrictChange = (next: string) => {
    setDistrictId(next)
    setCityId(ALL)
    setStpId(ALL)
    if (next !== ALL) setStateId('uttarakhand')
  }

  const handleCityChange = (next: string) => {
    setCityId(next)
    setStpId(ALL)
    if (next !== ALL) {
      const point = PLANT_POINTS.find((candidate) => candidate.city === next)
      if (point) {
        setStateId('uttarakhand')
        setDistrictId(point.district)
      }
    }
  }

  const handleStpChange = (next: string) => {
    setStpId(next)
    const point = PLANT_POINTS.find((candidate) => candidate.id === next)
    if (point) setFocusPoint(point)
  }

  const handleMarkerClick = (point: StpMapPoint) => {
    const selected = point as MappedPlant
    if (selected.city && selected.district) {
      setStateId('uttarakhand')
      setDistrictId(selected.district)
      setCityId(selected.city)
    }
    setStpId(point.id)
    setFocusPoint(point)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {})
      return
    }
    await containerRef.current.requestFullscreen().catch(() => {})
  }

  const openDetails = (point: StpMapPoint) => {
    const selected = point as MappedPlant
    navigate(`/stp-management?plant=${encodeURIComponent(selected.detailCode ?? selected.id)}&name=${encodeURIComponent(point.label)}`)
  }

  return (
    <section
      ref={containerRef}
      className={`relative flex min-h-[470px] flex-col overflow-hidden rounded-[14px] border border-[#DCE6F1] bg-white shadow-[0_4px_18px_rgba(23,43,77,0.12)] ${fullscreen ? 'h-dvh min-h-0 w-screen rounded-none' : ''}`}
    >
      <header className="shrink-0 border-b border-[#E8EEF5] bg-white px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div>
            <h2 className="text-[16px] font-bold leading-5 text-[#172B4D] sm:text-[18px]">STP Locations in Uttarakhand</h2>
            <p className="mt-0.5 text-[12px] font-medium leading-4 text-[#52647A] sm:text-[13px]">Live Status &amp; STP Management Overview</p>
          </div>
          <label className="flex h-[34px] w-full items-center gap-2 rounded-[8px] border border-[#DCE6F1] bg-[#FBFDFF] px-3 shadow-sm sm:w-[210px]">
            <Search size={15} className="shrink-0 text-[#60758D]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search STP..."
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[#172B4D] outline-none placeholder:text-[#9AA8B8]"
              aria-label="Search STP locations"
            />
          </label>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Select options={stateOptions} value={stateId} onChange={handleStateChange} className="w-full" buttonClassName="!h-[34px] !rounded-[8px] !pl-3 !text-[12px]" chevronSize={14} placeholder="All States" />
          <Select options={districtOptions} value={districtId} onChange={handleDistrictChange} className="w-full" buttonClassName="!h-[34px] !rounded-[8px] !pl-3 !text-[12px]" chevronSize={14} placeholder="All Districts" />
          <Select options={cityOptions} value={cityId} onChange={handleCityChange} className="w-full" buttonClassName="!h-[34px] !rounded-[8px] !pl-3 !text-[12px]" chevronSize={14} placeholder="All Cities" />
          <Select options={stpOptions} value={stpId} onChange={handleStpChange} className="w-full" buttonClassName="!h-[34px] !rounded-[8px] !pl-3 !text-[12px]" chevronSize={14} placeholder="All STPs" />
        </div>
      </header>

      <div className="relative min-h-[350px] flex-1">
        <MapContainer
          center={INITIAL_CENTER}
          zoom={INITIAL_ZOOM}
          minZoom={5}
          maxZoom={17}
          scrollWheelZoom
          zoomControl={false}
          className="absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:bg-black/50 [&_.leaflet-control-attribution]:text-[10px] [&_.leaflet-control-attribution]:text-white/80 [&_.leaflet-popup-content-wrapper]:rounded-[10px] [&_.leaflet-popup-content-wrapper]:shadow-[0_8px_30px_rgba(23,43,77,0.22)] [&_.leaflet-popup-content]:m-3"
        >
          <ZoomControl position="bottomleft" />
          {satellite ? (
            <>
              <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                opacity={0.85}
              />
            </>
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          <MapInvalidateSize />
          <MapInitialBounds />
          <MapFocus point={focusPoint} />
          <MapPopupController selectedId={stpId} markers={markerRefs.current} />
          <MapPopupCloseReset
            markers={markerRefs.current}
            onReset={() => {
              setStateId(ALL)
              setDistrictId(ALL)
              setCityId(ALL)
              setStpId(ALL)
              setFocusPoint(null)
            }}
          />
          {visiblePoints.map((point) => (
            <Marker
              key={point.id}
              ref={(marker) => {
                if (marker) {
                  markerRefs.current.set(point.id, marker)
                  const label = marker.getElement()?.querySelector<HTMLButtonElement>('.stp-map-callout-label')
                  if (label) {
                    label.onclick = (event) => {
                      event.stopPropagation()
                      handleMarkerClick(point)
                      marker.openPopup()
                    }
                  }
                } else {
                  markerRefs.current.delete(point.id)
                }
              }}
              position={[point.lat, point.lng]}
              icon={plantLabelIcon(point)}
              eventHandlers={{ click: () => handleMarkerClick(point) }}
            >
              <Popup closeButton>
                <StpPopup point={point} onViewDetails={() => openDetails(point)} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="absolute right-3 top-3 z-[500] flex flex-col gap-2">
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? 'Exit fullscreen map' : 'View fullscreen map'}
            className="grid size-9 place-items-center rounded-[8px] border border-white/80 bg-white/95 text-[#24384F] shadow-md transition hover:bg-white"
          >
            {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setSatellite((value) => !value)}
          className="absolute bottom-3 right-3 z-[500] flex h-9 items-center gap-2 rounded-[8px] border border-white/80 bg-white/95 px-3 text-[11px] font-semibold text-[#24384F] shadow-md transition hover:bg-white"
          aria-label={`Switch to ${satellite ? 'street' : 'satellite'} map`}
        >
          <Layers3 size={15} />
          {satellite ? 'Satellite' : 'Street'}
        </button>
      </div>
    </section>
  )
}
