import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import AccordionCard from '../components/stp/AccordionCard'
import LivePill from '../components/stp/LivePill'
import RealtimeParametersPanel from '../components/stp/RealtimeParametersPanel'
import ParameterTrendPanel from '../components/stp/ParameterTrendPanel'
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
  fetchDashboardPlants,
  resolveStpDetail,
  toPlantOptions,
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

export default function StpManagement() {
  const { tab: slug } = useParams()
  const navigate = useNavigate()
  const [plantOptions, setPlantOptions] = useState(FALLBACK_PLANT_OPTIONS)
  const [plantCode, setPlantCode] = useState(FALLBACK_PLANT_OPTIONS[0]?.id)
  const [range, setRange] = useState(defaultDateRange)
  const [billingMonth, setBillingMonth] = useState('June 2026')

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled || plants.length === 0) return

      const next = toPlantOptions(plants)
      setPlantOptions(next)
      setPlantCode((current) => (next.some((option) => option.id === current) ? current : next[0].id))
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [])

  // The active tab lives in the URL so the sidebar can deep link into it.
  const tab = stpTabFromSlug(slug) ?? stpSectionTabs[0]
  const setTab = (next) => navigate(stpTabPath(next))

  const selectedPlant = useMemo(
    () => plantOptions.find((option) => option.id === plantCode) ?? plantOptions[0],
    [plantOptions, plantCode],
  )
  const stp = resolveStpDetail(selectedPlant)
  const TabBody = TAB_BODY[tab]
  const refreshTick = useSharedRefreshTick(Boolean(selectedPlant?.plantCode))

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
        onChange={setPlantCode}
        className="w-1/2 self-end"
        align="right"
      />

      <StpHeaderCard stp={stp} plantCode={selectedPlant?.plantCode} />

      <AccordionCard title="Realtime Parameter Values" badge={<LivePill />}>
        <RealtimeParametersPanel plantCode={selectedPlant?.plantCode} refreshTick={refreshTick} />
      </AccordionCard>

      <AccordionCard title="Parameter Trend Analysis">
        <ParameterTrendPanel />
      </AccordionCard>

      <SectionTabs tabs={stpSectionTabs} active={tab} onChange={setTab} className="mt-[6px]" />

      <Card className="mt-[6px] p-[15px]">
        <TabSectionHeader tab={tab} right={headerControls} />

        <div className="mt-[15px]">
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
