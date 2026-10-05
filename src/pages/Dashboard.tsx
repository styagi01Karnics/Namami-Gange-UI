import { useEffect, useMemo, useState } from 'react'
import GreetingCard from '../components/cards/GreetingCard'
import StpCountCards from '../components/cards/StpCountCards'
import StpPerformanceCard from '../components/cards/StpPerformanceCard'
import StpCapacityCard from '../components/cards/StpCapacityCard'
import CriticalStpCard from '../components/cards/CriticalStpCard'
import { stpSummary } from '../data/mockData'
import { fetchDashboardPlants } from '../api/plants'

export default function Dashboard() {
  const [plantCount, setPlantCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadPlants() {
      const plants = await fetchDashboardPlants()
      if (cancelled || plants.length === 0) return
      setPlantCount(plants.length)
    }

    loadPlants()
    return () => {
      cancelled = true
    }
  }, [])

  const counts = useMemo(() => {
    // /dashboard/plants returns the plant list only (no online/offline flags yet).
    // When it loads, mirror prior behavior: count them as active; otherwise use mock totals.
    if (plantCount != null) {
      return { total: plantCount, active: plantCount, nonActive: 0 }
    }
    return {
      total: stpSummary.total,
      active: stpSummary.active,
      nonActive: stpSummary.nonActive,
    }
  }, [plantCount])

  return (
    <div className="flex flex-col gap-[15px] pb-[22px]">
      <GreetingCard />

      {/* Left: 3 count cards + bar chart | Right: capacity (same total height) */}
      {/* Figma: left 624 / right 496 (~1.26:1), row height 402 */}
      <div className="grid grid-cols-[minmax(0,624fr)_minmax(0,496fr)] items-stretch gap-[16px]">
        <div className="flex min-h-0 flex-col gap-[16px]">
          <StpCountCards total={counts.total} active={counts.active} nonActive={counts.nonActive} />
          <div className="min-h-0 flex-1">
            <StpPerformanceCard
              activePercent={stpSummary.activePercent}
              nonActivePercent={stpSummary.nonActivePercent}
              activeDelta={stpSummary.activeDelta}
              nonActiveDelta={stpSummary.nonActiveDelta}
            />
          </div>
        </div>

        <div className="min-h-[402px]">
          <StpCapacityCard />
        </div>
      </div>

      <CriticalStpCard />
    </div>
  )
}
