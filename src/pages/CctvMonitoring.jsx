import { useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import CctvMonitoringTab from '../components/cctv/CctvMonitoringTab'
import { defaultDateRange, stpDetails } from '../data/mockData'

const CCTV_STP_OPTIONS = [{ id: 'jagjeetpur-68', label: '68 MLD STP, Jagjeetpur' }]

export default function CctvMonitoring() {
  const [stpId, setStpId] = useState(CCTV_STP_OPTIONS[0].id)
  const [range, setRange] = useState(defaultDateRange)

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      <Select
        options={CCTV_STP_OPTIONS}
        value={stpId}
        onChange={setStpId}
        className="w-1/2 self-end"
        align="right"
      />

      <StpHeaderCard stp={stpDetails[stpId]} showPenalty={false} />

      <Card className="p-[15px]">
        <DateRangeField value={range} onChange={setRange} className="ml-auto w-[54%]" />

        <div className="mt-[15px]">
          <CctvMonitoringTab />
        </div>
      </Card>
    </div>
  )
}
