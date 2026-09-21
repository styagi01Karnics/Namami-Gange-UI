import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Select from '../ui/Select'
import DateRangeField from '../ui/DateRangeField'
import SectionTabs from '../stp/SectionTabs'
import { ExportMetaProvider } from '../export/exportMeta'
import { REPORT_TABS } from '../../routes'
import { defaultDateRange } from '../../data/mockData'
import {
  ALL_STP_FILTER_OPTION,
  fetchDashboardPlants,
  toFilterPlantOptions,
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

/** Filter bar + tab strip + page body shared by all five Data Reports sub-pages. */
export default function ReportShell({ children }: { children?: ReactNode }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [stpOptions, setStpOptions] = useState<ReportStpOption[]>(() => toFilterPlantOptions([]))
  const [stpId, setStpId] = useState<string>(ALL_STP_FILTER_OPTION.id)
  const [range, setRange] = useState(defaultDateRange)

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled) return
      const next = toFilterPlantOptions(plants)
      setStpOptions(next)
      setStpId((current) => (next.some((option) => option.id === current) ? current : ALL_STP_FILTER_OPTION.id))
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
      plantCode: selected?.id === ALL_STP_FILTER_OPTION.id ? undefined : selected?.plantCode,
      plantLabel: selected?.id === ALL_STP_FILTER_OPTION.id ? undefined : selected?.label,
      stpOptions,
      range,
      setRange,
    }),
    [stpId, selected, stpOptions, range],
  )

  const active = REPORT_TABS.find((t) => t.path === pathname)?.label ?? TAB_LABELS[0]
  const openTab = (label: string) => navigate(REPORT_TABS.find((t) => t.label === label)!.path)

  return (
    <ReportFiltersContext.Provider value={filters}>
      <ExportMetaProvider value={{ rangeLabel: range, badge: null, address: null }}>
        <div className="flex flex-col gap-[16px] pb-[22px]">
          <div className="flex items-center justify-end gap-[16px]">
            <Select options={stpOptions} value={stpId} onChange={setStpId} className="w-[33%]" align="right" />
            <DateRangeField value={range} onChange={setRange} className="w-[28%]" />
          </div>

          <SectionTabs tabs={TAB_LABELS} active={active} onChange={openTab} />

          {children}
        </div>
      </ExportMetaProvider>
    </ReportFiltersContext.Provider>
  )
}
