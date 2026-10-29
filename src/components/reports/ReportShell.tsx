import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Select from '../ui/Select'
import SectionTabs from '../stp/SectionTabs'
import DateRangeField from '../ui/DateRangeField'
import { ExportMetaProvider } from '../export/exportMeta'
import { REPORT_TABS } from '../../routes'
import { defaultDateRange } from '../../data/mockData'
import {
  FALLBACK_PLANT_OPTIONS,
  fetchDashboardPlants,
  resolveStpDetail,
  toPlantOptions,
} from '../../api/plants'

const TAB_LABELS = REPORT_TABS.map((t) => t.label)

export type ReportStpOption = {
  id: string
  label: string
  plantCode?: string
  stpId?: string
}

type ReportFiltersContextValue = {
  stpId: string
  setStpId: (value: string) => void
  plantCode?: string
  plantLabel?: string
  stpOptions: ReportStpOption[]
  range: string
  setRange: (value: string) => void
}

const ReportFiltersContext = createContext<ReportFiltersContextValue | null>(null)

export function useReportFilters() {
  const ctx = useContext(ReportFiltersContext)
  if (!ctx) throw new Error('useReportFilters must be used within ReportShell')
  return ctx
}

const initialIndividualOptions: ReportStpOption[] = FALLBACK_PLANT_OPTIONS.map((plant) => ({
  id: plant.plantCode,
  label: plant.label,
  plantCode: plant.plantCode,
  stpId: plant.stpId,
}))

/** Filter bar + tab strip + page body shared by all Data Reports sub-pages. */
export default function ReportShell({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stpOptions, setStpOptions] = useState<ReportStpOption[]>(() => initialIndividualOptions)
  const [stpId, setStpId] = useState<string>(initialIndividualOptions[0]?.id ?? '68mldjag')
  const [range, setRange] = useState(defaultDateRange)

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled) return
      const plantList = plants.length > 0 ? toPlantOptions(plants) : FALLBACK_PLANT_OPTIONS
      const next: ReportStpOption[] = plantList.map((p) => ({
        id: p.plantCode,
        label: p.label,
        plantCode: p.plantCode,
        stpId: p.stpId,
      }))
      setStpOptions(next)
      setStpId((current) => (next.some((option) => option.id === current) ? current : next[0]?.id ?? '68mldjag'))
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [])

  const selected = useMemo(
    () => stpOptions.find((option) => option.id === stpId) ?? stpOptions[0],
    [stpOptions, stpId],
  )

  const filters = useMemo<ReportFiltersContextValue>(
    () => ({
      stpId,
      setStpId,
      plantCode: selected?.plantCode,
      plantLabel: selected?.label,
      stpOptions,
      range,
      setRange,
    }),
    [stpId, setStpId, selected, stpOptions, range],
  )

  const stpDetail = selected
    ? resolveStpDetail({ ...selected, plantCode: selected.plantCode ?? selected.id, stpId: selected.stpId ?? '' })
    : undefined
  const active = REPORT_TABS.find((t) => t.path === pathname)?.label ?? TAB_LABELS[0]
  const openTab = (label: string) => {
    const target = REPORT_TABS.find((t) => t.label === label)
    if (target) navigate(target.path)
  }

  return (
    <ReportFiltersContext.Provider value={filters}>
      <ExportMetaProvider value={{ stpName: stpDetail?.name ?? selected?.label ?? null, rangeLabel: range, badge: null, address: stpDetail?.address ?? null }}>
        <div className="flex flex-col gap-[16px] pb-[22px]">
          <SectionTabs tabs={TAB_LABELS} active={active} onChange={openTab} />

          {children}
        </div>
      </ExportMetaProvider>
    </ReportFiltersContext.Provider>
  )
}
