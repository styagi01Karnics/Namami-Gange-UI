import { useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import InventoryTab from '../components/inventory/InventoryTab'
import { ExportMetaProvider, stpExportMeta } from '../components/export/exportMeta'
import { defaultDateRange, stpDetails, stpOptions } from '../data/mockData'

export default function Inventory() {
  const [stpId, setStpId] = useState(stpOptions[0].id)
  const [range, setRange] = useState(defaultDateRange)
  const stp = stpDetails[stpId]

  return (
    <ExportMetaProvider value={stpExportMeta(stp, range)}>
      <div className="flex flex-col gap-[15px] pb-[22px]">
        <Select options={stpOptions} value={stpId} onChange={setStpId} className="w-1/2 self-end" align="right" />

        <StpHeaderCard stp={stp} showPenalty={false} />

        <Card className="p-[15px]">
          <DateRangeField value={range} onChange={setRange} className="ml-auto w-[54%]" />

          <div className="mt-[15px]">
            <InventoryTab />
          </div>
        </Card>
      </div>
    </ExportMetaProvider>
  )
}
