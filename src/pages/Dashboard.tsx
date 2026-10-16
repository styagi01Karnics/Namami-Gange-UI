import DashboardKpiRow from '../components/cards/DashboardKpiRow'
import StpLocationsMapCard from '../components/cards/StpLocationsGISMapCard'
import CapacityUtilizationCard from '../components/cards/CapacityUtilizationCard'
import LatestViolationsSliderCard from '../components/cards/LatestViolationsSliderCard'
import LiveStpDataCard from '../components/cards/LiveStpDataCard'
import RealtimeStpTrendsCard from '../components/cards/RealtimeStpTrendsCard'
import TopPerformingStpsCard from '../components/cards/TopPerformingStpsCard'
import NonPerformingStpsCard from '../components/cards/NonPerformingStpsCard'

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-[10px]">
      <DashboardKpiRow />

      <div className="grid grid-cols-1 items-stretch gap-[10px] xl:grid-cols-[minmax(0,624fr)_minmax(0,496fr)]">
        <StpLocationsMapCard />
        <div className="flex flex-col gap-[10px] min-h-0">
          <CapacityUtilizationCard />
          <LatestViolationsSliderCard className="flex-1 min-h-[220px]" />
        </div>
      </div>

      <LiveStpDataCard />

      <RealtimeStpTrendsCard />

      <div className="grid grid-cols-1 items-stretch gap-[10px] lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="min-h-0 h-full">
          <TopPerformingStpsCard />
        </div>
        <div className="min-h-0 h-full">
          <NonPerformingStpsCard />
        </div>
      </div>
    </div>
  )
}
