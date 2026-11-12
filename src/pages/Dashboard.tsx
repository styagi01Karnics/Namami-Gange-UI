import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardKpiRow from '../components/cards/DashboardKpiRow'
import StpLocationsMapCard from '../components/cards/StpLocationsGISMapCard'
import CapacityUtilizationCard from '../components/cards/CapacityUtilizationCard'
import MonitoringCoverageCard from '../components/cards/MonitoringCoverageCard'
import LiveStpDataCard from '../components/cards/LiveStpDataCard'
import RealtimeStpTrendsCard from '../components/cards/RealtimeStpTrendsCard'
import TopPerformingStpsCard from '../components/cards/TopPerformingStpsCard'
import NonPerformingStpsCard from '../components/cards/NonPerformingStpsCard'
import Toast, { type ToastFeedback } from '../components/ui/Toast'
import { StpDetailsProvider } from '../context/StpDetailsContext'

export default function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState<ToastFeedback | null>(null)

  useEffect(() => {
    const message = (location.state as { stpAccessError?: string } | null)?.stpAccessError
    if (!message) return
    setFeedback({ id: Date.now(), tone: 'error', text: message })
    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, location.state, navigate])

  return (
    <StpDetailsProvider>
      <div className="flex flex-col gap-[10px]">
        {feedback && <Toast feedback={feedback} onClose={() => setFeedback(null)} />}
        <DashboardKpiRow />

        <div className="grid grid-cols-1 items-stretch gap-[10px] xl:grid-cols-[minmax(0,624fr)_minmax(0,496fr)]">
          <StpLocationsMapCard />
          <div className="flex flex-col gap-[10px] min-h-0">
            <CapacityUtilizationCard />
            <MonitoringCoverageCard className="flex-1 min-h-[220px]" />
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
    </StpDetailsProvider>
  )
}

