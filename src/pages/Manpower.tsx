import { useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import ManpowerTab from '../components/manpower/ManpowerTab'
import { todayLabel } from '../components/manpower/todayManpower'
import { ExportMetaProvider, stpExportMeta } from '../components/export/exportMeta'
import { stpDetails, stpOptions } from '../data/mockData'

/**
 * Standalone Manpower section. Renders the same widget set as the Manpower tab
 * inside STP Management (shared via components/manpower), minus the tab bar.
 */
export default function Manpower() {
  const [stpId, setStpId] = useState(stpOptions[0].id)
  const stp = stpDetails[stpId]

  return (
    <ExportMetaProvider value={stpExportMeta(stp, `Today, ${todayLabel()}`)}>
      <div className="flex flex-col gap-[15px] pb-[22px]">
        <Select options={stpOptions} value={stpId} onChange={setStpId} className="w-1/2 self-end" align="right" />

        <StpHeaderCard stp={stp} />

        <Card className="p-[15px]">
          <p className="ml-auto w-fit text-[13px] font-semibold text-[#003C7A]">Today, {todayLabel()}</p>

          <div className="mt-[15px]">
            <ManpowerTab stpId={stpId} />
          </div>
        </Card>
      </div>
    </ExportMetaProvider>
  )
}
