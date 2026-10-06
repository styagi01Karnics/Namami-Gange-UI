import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Select from '../ui/Select'
import {
  findStpMapPath,
  getStpMapCityOptions,
  getStpMapDistrictOptions,
  getStpMapStateOptions,
  getStpMapStpOptions,
  stpMapHierarchy,
  stpMapRiskLevels,
  type StpMapPoint,
  type StpMapRiskId,
} from '../../data/mockData'

const RISK_COLOR: Record<StpMapRiskId, string> = {
  normal: '#22C55E',
  watch: '#EAB308',
  warning: '#F97316',
  critical: '#EF4444',
}

const DEFAULT_CENTER: LatLngExpression = [29.9, 78.2]
const DEFAULT_ZOOM = 7
const ALL = 'all'

type FlyTarget = { lat: number; lng: number; zoom: number }

function findPointById(nodes: StpMapPoint[], id: string): StpMapPoint | null {
  for (const node of nodes) {
    if (node.id === id) return node
    if (node.children?.length) {
      const found = findPointById(node.children, id)
      if (found) return found
    }
  }
  return null
}

/** Visible nodes for the current zoom — parents hide once their children unlock. */
function collectVisiblePoints(nodes: StpMapPoint[], zoom: number): StpMapPoint[] {
  const visible: StpMapPoint[] = []

  for (const node of nodes) {
    if (zoom < node.minZoom) continue

    const childMin =
      node.children?.length != null && node.children.length > 0
        ? Math.min(...node.children.map((c) => c.minZoom))
        : Number.POSITIVE_INFINITY

    if (node.children?.length && zoom >= childMin) {
      visible.push(...collectVisiblePoints(node.children, zoom))
    } else {
      visible.push(node)
    }
  }

  return visible
}

function flyZoomFor(point: StpMapPoint): number {
  if (!point.children?.length) return Math.max(point.minZoom + 2, 12)
  const childMin = Math.min(...point.children.map((c) => c.minZoom))
  return Math.max(point.minZoom + 1, Math.min(childMin, 13))
}

function MapZoomWatcher({ onZoom }: { onZoom: (zoom: number) => void }) {
  const map = useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
  })

  useEffect(() => {
    onZoom(map.getZoom())
  }, [map, onZoom])

  return null
}

function MapFlyTo({ target }: { target: FlyTarget | null }) {
  const map = useMap()

  useEffect(() => {
    if (!target) return
    map.flyTo([target.lat, target.lng], target.zoom, { duration: 0.85 })
  }, [map, target])

  return null
}

function MapInvalidateSize() {
  const map = useMap()

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(timer)
  }, [map])

  return null
}

function RiskLegend() {
  return (
    <div className="rounded-[10px] border border-white/15 bg-[#0B1220]/88 px-[12px] py-[10px] shadow-lg backdrop-blur-sm">
      <p className="mb-[8px] text-[12px] font-semibold leading-none text-white">Risk level</p>
      <ul className="flex flex-col gap-[7px]">
        {stpMapRiskLevels.map((level) => (
          <li key={level.id} className="flex items-center gap-[8px]">
            <span
              className="size-[10px] shrink-0 rounded-full ring-[1.5px] ring-white"
              style={{ backgroundColor: level.color }}
            />
            <span className="text-[11px] font-medium leading-none text-white/90">
              {level.label} {level.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function StpLocationsMapCard() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [stateId, setStateId] = useState(ALL)
  const [districtId, setDistrictId] = useState(ALL)
  const [cityId, setCityId] = useState(ALL)
  const [stpId, setStpId] = useState(ALL)
  const [flyTarget, setFlyTarget] = useState<FlyTarget | null>(null)

  const onZoom = useCallback((next: number) => setZoom(next), [])

  const stateOptions = useMemo(() => getStpMapStateOptions(), [])
  const districtOptions = useMemo(() => getStpMapDistrictOptions(stateId), [stateId])
  const cityOptions = useMemo(
    () => getStpMapCityOptions(stateId, districtId),
    [stateId, districtId],
  )
  const stpOptions = useMemo(
    () => getStpMapStpOptions(stateId, districtId, cityId),
    [stateId, districtId, cityId],
  )

  const flyToPoint = (point: StpMapPoint) => {
    setFlyTarget({ lat: point.lat, lng: point.lng, zoom: flyZoomFor(point) })
  }

  const flyToDefault = () => {
    setFlyTarget({
      lat: (DEFAULT_CENTER as [number, number])[0],
      lng: (DEFAULT_CENTER as [number, number])[1],
      zoom: DEFAULT_ZOOM,
    })
  }

  const visiblePoints = useMemo(() => {
    const points = collectVisiblePoints(stpMapHierarchy, zoom)

    if (stpId !== ALL) {
      const path = findStpMapPath(stpId)
      return path?.stp ? [path.stp] : points
    }

    if (cityId !== ALL) {
      const path = findStpMapPath(cityId)
      if (!path?.city) return points
      const cityKids = collectVisiblePoints([path.city], zoom)
      return cityKids.length ? cityKids : [path.city]
    }

    if (districtId !== ALL) {
      const path = findStpMapPath(districtId)
      if (!path?.district) return points
      const districtKids = collectVisiblePoints([path.district], zoom)
      return districtKids.length ? districtKids : [path.district]
    }

    if (stateId !== ALL) {
      const path = findStpMapPath(stateId)
      if (!path?.state) return points
      const stateKids = collectVisiblePoints([path.state], zoom)
      return stateKids.length ? stateKids : [path.state]
    }

    return points
  }, [zoom, stateId, districtId, cityId, stpId])

  const handleStateChange = (id: string) => {
    setStateId(id)
    setDistrictId(ALL)
    setCityId(ALL)
    setStpId(ALL)

    if (id === ALL) {
      flyToDefault()
      return
    }

    const point = findPointById(stpMapHierarchy, id)
    if (point) flyToPoint(point)
  }

  const handleDistrictChange = (id: string) => {
    setDistrictId(id)
    setCityId(ALL)
    setStpId(ALL)

    if (id === ALL) {
      if (stateId !== ALL) {
        const state = findPointById(stpMapHierarchy, stateId)
        if (state) flyToPoint(state)
        else flyToDefault()
      } else {
        flyToDefault()
      }
      return
    }

    const path = findStpMapPath(id)
    if (path) {
      setStateId(path.state.id)
      flyToPoint(path.district ?? path.state)
    }
  }

  const handleCityChange = (id: string) => {
    setCityId(id)
    setStpId(ALL)

    if (id === ALL) {
      if (districtId !== ALL) {
        const district = findPointById(stpMapHierarchy, districtId)
        if (district) flyToPoint(district)
        return
      }
      if (stateId !== ALL) {
        const state = findPointById(stpMapHierarchy, stateId)
        if (state) flyToPoint(state)
        return
      }
      flyToDefault()
      return
    }

    const path = findStpMapPath(id)
    if (path?.city) {
      setStateId(path.state.id)
      setDistrictId(path.district?.id ?? ALL)
      flyToPoint(path.city)
    }
  }

  const handleStpChange = (id: string) => {
    setStpId(id)

    if (id === ALL) {
      if (cityId !== ALL) {
        const city = findPointById(stpMapHierarchy, cityId)
        if (city) flyToPoint(city)
        return
      }
      if (districtId !== ALL) {
        const district = findPointById(stpMapHierarchy, districtId)
        if (district) flyToPoint(district)
        return
      }
      if (stateId !== ALL) {
        const state = findPointById(stpMapHierarchy, stateId)
        if (state) flyToPoint(state)
        return
      }
      flyToDefault()
      return
    }

    const path = findStpMapPath(id)
    if (path?.stp) {
      setStateId(path.state.id)
      setDistrictId(path.district?.id ?? ALL)
      setCityId(path.city?.id ?? ALL)
      flyToPoint(path.stp)
    }
  }

  const handleMarkerClick = (point: StpMapPoint) => {
    const path = findStpMapPath(point.id)
    if (!path) return

    setStateId(path.state.id)
    setDistrictId(path.district?.id ?? ALL)
    setCityId(path.city?.id ?? ALL)
    setStpId(path.stp?.id ?? ALL)

    if (point.children?.length) {
      setFlyTarget({
        lat: point.lat,
        lng: point.lng,
        zoom: Math.min(...point.children.map((c) => c.minZoom)),
      })
      return
    }

    setFlyTarget({ lat: point.lat, lng: point.lng, zoom: Math.max(zoom, 12) })
  }

  return (
    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[16px] shadow-[0px_0px_3px_3px_rgba(7,104,210,0.1)] xl:min-h-[300px]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={5}
        maxZoom={16}
        scrollWheelZoom
        zoomControl={false}
        attributionControl
        className="absolute inset-0 z-0 h-full w-full [&_.leaflet-control-attribution]:bg-black/50 [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution]:text-white/80"
      >
        <ZoomControl position="bottomleft" />
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          opacity={0.85}
        />

        <MapInvalidateSize />
        <MapZoomWatcher onZoom={onZoom} />
        <MapFlyTo target={flyTarget} />

        {visiblePoints.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={point.children?.length ? 8 : 6}
            pathOptions={{
              color: '#FFFFFF',
              weight: 2,
              fillColor: RISK_COLOR[point.risk],
              fillOpacity: 1,
            }}
            eventHandlers={{
              click: () => handleMarkerClick(point),
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={0.95}>
              <span className="font-semibold">{point.label}</span>
              {point.count ? ` · ${point.count}` : ''}
            </Tooltip>
            <Popup>
              <div className="min-w-[140px]">
                <p className="text-[13px] font-bold text-[#1F2A37]">{point.label}</p>
                {point.count && (
                  <p className="mt-[2px] text-[11px] text-[#5B6B7F]">{point.count}</p>
                )}
                <p className="mt-[6px] text-[11px] font-medium text-[#5B6B7F]">
                  Risk:{' '}
                  <span style={{ color: RISK_COLOR[point.risk] }}>
                    {point.risk} {point.riskPercent}%
                  </span>
                </p>
                {point.children?.length ? (
                  <p className="mt-[4px] text-[11px] text-[#0768D2]">Zoom in to see nested points</p>
                ) : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      <div className="pointer-events-none absolute left-[12px] top-[12px] z-[500]">
        <p className="text-[16px] font-bold leading-5 text-white drop-shadow">STP Locations</p>
        <p className="mt-[2px] text-[13px] font-medium leading-5 text-[#D2E1FF] drop-shadow">
          Live Status Overview
        </p>
      </div>

      <div className="absolute right-[12px] top-[12px] z-[500] flex max-w-[calc(100%-24px)] flex-col items-end gap-[8px] sm:max-w-none">
        <div className="flex flex-wrap items-center justify-end gap-[6px]">
          <Select
            options={stateOptions}
            value={stateId}
            onChange={handleStateChange}
            className="w-[100px]"
            buttonClassName="!h-[28px] !rounded-[7px] !pl-[8px] !pr-[6px] !text-[11px] shadow-card"
            chevronSize={12}
            align="right"
            placeholder="Select State"
          />
          <Select
            options={districtOptions}
            value={districtId}
            onChange={handleDistrictChange}
            className="w-[100px]"
            buttonClassName="!h-[28px] !rounded-[7px] !pl-[8px] !pr-[6px] !text-[11px] shadow-card"
            chevronSize={12}
            align="right"
            placeholder="Select District"
          />
          <Select
            options={cityOptions}
            value={cityId}
            onChange={handleCityChange}
            className="w-[108px]"
            buttonClassName="!h-[28px] !rounded-[7px] !pl-[8px] !pr-[6px] !text-[11px] shadow-card"
            chevronSize={12}
            align="right"
            placeholder="Select City"
          />
          <Select
            options={stpOptions}
            value={stpId}
            onChange={handleStpChange}
            className="w-[140px]"
            buttonClassName="!h-[28px] !rounded-[7px] !pl-[8px] !pr-[6px] !text-[11px] shadow-card"
            chevronSize={12}
            align="right"
            placeholder="Select STP"
          />
        </div>
        <RiskLegend />
      </div>
    </div>
  )
}
