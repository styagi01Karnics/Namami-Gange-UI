import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import AccordionCard from '../components/stp/AccordionCard'
import LivePill from '../components/stp/LivePill'
import RealtimeParametersPanel from '../components/stp/RealtimeParametersPanel'
import SectionTabs from '../components/stp/SectionTabs'
import TabSectionHeader from '../components/stp/TabSectionHeader'
import TabPlaceholder from '../components/stp/TabPlaceholder'
import ManpowerTab from '../components/manpower/ManpowerTab'
import InventoryTab from '../components/inventory/InventoryTab'
import CctvTab from '../components/cctv/CctvTab'
import CalibrationTab from '../components/calibration/CalibrationTab'
import TransactionLogsTab from '../components/transactions/TransactionLogsTab'
import ContractsTab from '../components/contracts/ContractsTab'
import ComplianceTab from '../components/compliance/ComplianceTab'
import BillingTab from '../components/billing/BillingTab'
import { defaultDateRange, stpDetails, stpSectionTabs } from '../data/mockData'
import { stpTabFromSlug, stpTabPath } from '../routes'
import { ExportMetaProvider, stpExportMeta } from '../components/export/exportMeta'
import {
  FALLBACK_PLANT_OPTIONS,
  loadPlantPickerOptions,
  resolveStpDetail,
  type PlantOption,
} from '../api/plants'
import { useSharedRefreshTick } from '../hooks/useSharedRefreshTick'

/** Each section tab renders the same widget set as its standalone page. */
const TAB_BODY = {
  Manpower: ManpowerTab,
  Inventory: InventoryTab,
  CCTV: CctvTab,
  'Remote Calibration': CalibrationTab,
  'Transaction Logs': TransactionLogsTab,
  Contracts: ContractsTab,
  Compliance: ComplianceTab,
  Billing: BillingTab,
}

function resolvePlantId(options: PlantOption[], plantParam: string | null) {
  if (!plantParam) return null
  const byCode = options.find((option) => option.id === plantParam || option.plantCode === plantParam)
  if (byCode) return byCode.id
  const byStp = options.find((option) => option.stpId === plantParam)
  return byStp?.id ?? null
}

export default function StpManagement() {
  const { tab: slug } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const plantParam = searchParams.get('plant')
  const focusParam = searchParams.get('focus')
  const [plantOptions, setPlantOptions] = useState(FALLBACK_PLANT_OPTIONS)
  const [plantCode, setPlantCode] = useState(
    () => resolvePlantId(FALLBACK_PLANT_OPTIONS, plantParam) ?? FALLBACK_PLANT_OPTIONS[0]?.id,
  )
  const [range, setRange] = useState(defaultDateRange)
  const [billingMonth, setBillingMonth] = useState('June 2026')

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const next = await loadPlantPickerOptions()
      if (cancelled || next.length === 0) return

      setPlantOptions(next)
      setPlantCode((current) => {
        const fromQuery = resolvePlantId(next, plantParam)
        if (fromQuery) return fromQuery
        return next.some((option) => option.id === current) ? current : next[0].id
      })
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [plantParam])

  // Apply deep-link plant selection whenever ?plant= changes.
  useEffect(() => {
    const matched = resolvePlantId(plantOptions, plantParam)
    if (matched) setPlantCode(matched)
  }, [plantParam, plantOptions])

  // The active tab lives in the URL so the sidebar can deep link into it.
  const tab = stpTabFromSlug(slug) ?? stpSectionTabs[0]
  const setTab = (next) => {
    const nextPath = stpTabPath(next)
    if (plantCode) {
      navigate(`${nextPath}?plant=${encodeURIComponent(plantCode)}`)
      return
    }
    navigate(nextPath)
  }

  const selectedPlant = useMemo(
    () => plantOptions.find((option) => option.id === plantCode) ?? plantOptions[0],
    [plantOptions, plantCode],
  )
  const stp = resolveStpDetail(selectedPlant)
  const TabBody = TAB_BODY[tab]
  const refreshTick = useSharedRefreshTick(Boolean(selectedPlant?.plantCode))

  // Focus Compliance section when arriving from dashboard non-performing / top links.
  useEffect(() => {
    if (tab !== 'Compliance') return undefined
    const timer = window.setTimeout(() => {
      document.getElementById('stp-section-compliance')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [tab, plantCode])

  // Focus Realtime Parameter Values when arriving from Live Data links.
  useEffect(() => {
    if (focusParam !== 'realtime') return undefined
    const timer = window.setTimeout(() => {
      document.getElementById('stp-section-realtime')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [focusParam, plantCode])

  const onPlantChange = (next: string) => {
    setPlantCode(next)
    const nextParams = new URLSearchParams(searchParams)
    if (next) nextParams.set('plant', next)
    else nextParams.delete('plant')
    setSearchParams(nextParams, { replace: true })
  }

  // Billing is settled a month at a time, so it swaps the range for a single
  // month plus the invoice action.
  const headerControls =
    tab === 'Billing' ? (
      <div className="flex shrink-0 items-center gap-[14px]">
        <DateRangeField compact value={billingMonth} onChange={setBillingMonth} className="w-[205px]" />
        <Button variant="outline" className="h-[32px] px-[14px]">
          Generate Invoice
        </Button>
      </div>
    ) : (
      <DateRangeField compact value={range} onChange={setRange} className="w-[236px] shrink-0" />
    )

  return (
    <ExportMetaProvider value={stpExportMeta(stp, tab === 'Billing' ? billingMonth : range)}>
      <div className="flex flex-col gap-[15px] pb-[22px]">
        <Select
          options={plantOptions}
          value={selectedPlant?.id}
          onChange={onPlantChange}
          className="w-1/2 self-end"
          align="right"
        />

        <StpHeaderCard stp={stp} plantCode={selectedPlant?.plantCode} />

        <AccordionCard
          id="stp-section-realtime"
          title="Realtime Parameter Values"
          badge={<LivePill />}
          defaultOpen
        >
          <RealtimeParametersPanel plantCode={selectedPlant?.plantCode} refreshTick={refreshTick} />
        </AccordionCard>

        <SectionTabs tabs={stpSectionTabs} active={tab} onChange={setTab} className="mt-[2px]" />

        <Card
          id={tab === 'Compliance' ? 'stp-section-compliance' : undefined}
          className="mt-[2px] scroll-mt-[24px] rounded-[12px] border-0 p-[16px] shadow-card"
        >
          <TabSectionHeader tab={tab} right={headerControls} />

          <div className="mt-[16px]">
            {TabBody ? (
              tab === 'Compliance' ? (
                <ComplianceTab
                  plantCode={selectedPlant?.plantCode}
                  exportLabel={
                    (selectedPlant?.stpId && stpDetails[selectedPlant.stpId]?.name) ||
                    selectedPlant?.label ||
                    stp.name
                  }
                  dateRangeLabel={range}
                  stpManagementPdf
                />
              ) : (
                <TabBody
                  stpId={selectedPlant?.stpId}
                  plantCode={selectedPlant?.plantCode}
                  refreshTick={refreshTick}
                />
              )
            ) : (
              <TabPlaceholder name={tab} />
            )}
          </div>
        </Card>
      </div>
    </ExportMetaProvider>
  )
}
