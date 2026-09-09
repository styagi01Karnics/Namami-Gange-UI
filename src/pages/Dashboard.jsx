import TotalStpCard from '../components/cards/TotalStpCard'
import OverallComplianceCard from '../components/cards/OverallComplianceCard'
import ManpowerCard from '../components/cards/ManpowerCard'
import FlowCard from '../components/cards/FlowCard'
import TotalChemicalCard from '../components/cards/TotalChemicalCard'
import InletOutletChart from '../components/cards/InletOutletChart'
import CriticalStpCard from '../components/cards/CriticalStpCard'
import Filters from '../layout/Filters'
import { inletFlow, outletFlow } from '../data/mockData'

export default function Dashboard() {
  return (
    <>
      <Filters />

      <div className="flex items-start gap-[15px] pb-[22px]">
        {/* main column */}
        <div className="flex min-w-0 flex-1 flex-col gap-[15px]">
          <div className="grid grid-cols-[1.4fr_1fr] gap-[15px]">
            <TotalStpCard />
            <OverallComplianceCard />
          </div>

          <div className="grid grid-cols-2 gap-[15px]">
            <FlowCard data={inletFlow} variant="inlet" />
            <FlowCard data={outletFlow} variant="outlet" />
          </div>

          <InletOutletChart />
        </div>

        {/* right rail */}
        <div className="flex w-[364px] shrink-0 flex-col gap-[15px]">
          <ManpowerCard />
          <TotalChemicalCard />
          <CriticalStpCard />
        </div>
      </div>
    </>
  )
}
