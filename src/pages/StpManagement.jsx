import { useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import AccordionCard from '../components/stp/AccordionCard'
import LivePill from '../components/stp/LivePill'
import RealtimeParametersPanel from '../components/stp/RealtimeParametersPanel'
import ParameterTrendPanel from '../components/stp/ParameterTrendPanel'
import SectionTabs from '../components/stp/SectionTabs'
import TabPlaceholder from '../components/stp/TabPlaceholder'
import ManpowerTab from '../components/manpower/ManpowerTab'
import InventoryTab from '../components/inventory/InventoryTab'
import CctvMonitoringTab from '../components/cctv/CctvMonitoringTab'
import RemoteCalibrationTab from '../components/calibration/RemoteCalibrationTab'
import TransactionLogsTab from '../components/logs/TransactionLogsTab'
import ContractsTab from '../components/contracts/ContractsTab'
import ComplianceTab from '../components/compliance/ComplianceTab'
import { defaultDateRange, stpDetails, stpOptions, stpSectionTabs } from '../data/mockData'

const DEFAULT_STP_ID = 'jagjeetpur-68'

function StpSectionContent({ tab, stpId, stpName }) {
  switch (tab) {
    case 'Manpower':
      return <ManpowerTab stpId={stpId} stpName={stpName} />
    case 'Inventory':
      return <InventoryTab stpId={stpId} />
    case 'CCTV Monitoring':
      return <CctvMonitoringTab stpId={stpId} />
    case 'Remote Calibration':
      return <RemoteCalibrationTab stpId={stpId} />
    case 'Transaction Logs':
      return <TransactionLogsTab stpId={stpId} />
    case 'Contracts':
      return <ContractsTab stpId={stpId} />
    case 'Compliance':
      return <ComplianceTab stpId={stpId} />
    default:
      return <TabPlaceholder name={tab} />
  }
}

export default function StpManagement() {
  const [stpId, setStpId] = useState(DEFAULT_STP_ID)
  const [tab, setTab] = useState(stpSectionTabs[0])
  const [range, setRange] = useState(defaultDateRange)

  const stp = stpDetails[stpId]

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      <Select
        options={stpOptions}
        value={stpId}
        onChange={setStpId}
        className="w-1/2 self-end"
        align="right"
      />

      <StpHeaderCard key={stpId} stp={stp} />

      <AccordionCard title="Realtime Parameter Values" badge={<LivePill />}>
        <RealtimeParametersPanel key={stpId} stpId={stpId} />
      </AccordionCard>

      <AccordionCard title="Parameter Trend Analysis">
        <ParameterTrendPanel key={stpId} stpId={stpId} />
      </AccordionCard>

      <Card className="p-[15px]">
        <DateRangeField value={range} onChange={setRange} className="w-[54%] self-end ml-auto" />

        <div className="mt-[14px]">
          <SectionTabs tabs={stpSectionTabs} active={tab} onChange={setTab} />
        </div>

        <div className="mt-[15px]">
          <StpSectionContent key={`${stpId}-${tab}`} tab={tab} stpId={stpId} stpName={stp.name} />
        </div>
      </Card>
    </div>
  )
}
