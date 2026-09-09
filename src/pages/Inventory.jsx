import { useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import InventoryTab from '../components/inventory/InventoryTab'
import { defaultDateRange, stpDetails, stpOptions } from '../data/mockData'

export default function Inventory() {
  const [stpId, setStpId] = useState(stpOptions[0].id)
  const [range, setRange] = useState(defaultDateRange)

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      <Select options={stpOptions} value={stpId} onChange={setStpId} className="w-1/2 self-end" align="right" />

      <StpHeaderCard key={stpId} stp={stpDetails[stpId]} showPenalty={false} />

      <Card className="p-[15px]">
        <DateRangeField value={range} onChange={setRange} className="ml-auto w-[54%]" />

        <div className="mt-[15px]">
          <InventoryTab key={stpId} stpId={stpId} />
        </div>
      </Card>
    </div>
  )
}
