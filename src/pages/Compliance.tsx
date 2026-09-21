import { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Select from '../components/ui/Select'
import DateRangeField from '../components/ui/DateRangeField'
import StpHeaderCard from '../components/stp/StpHeaderCard'
import ComplianceTab from '../components/compliance/ComplianceTab'
import { ExportMetaProvider, stpExportMeta } from '../components/export/exportMeta'
import { defaultDateRange, stpDetails } from '../data/mockData'
import {
  FALLBACK_PLANT_OPTIONS,
  fetchDashboardPlants,
  resolveStpDetail,
  toPlantOptions,
} from '../api/plants'

export default function Compliance() {
  const [plantOptions, setPlantOptions] = useState(FALLBACK_PLANT_OPTIONS)
  const [plantCode, setPlantCode] = useState(FALLBACK_PLANT_OPTIONS[0]?.id)
  const [range, setRange] = useState(defaultDateRange)

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

  const selectedPlant = useMemo(
    () => plantOptions.find((option) => option.id === plantCode) ?? plantOptions[0],
    [plantOptions, plantCode],
  )
  const stp = resolveStpDetail(selectedPlant)

  return (
    <ExportMetaProvider value={stpExportMeta(stp, range)}>
      <div className="flex flex-col gap-[15px] pb-[22px]">
        <Select
          options={plantOptions}
          value={selectedPlant?.id}
          onChange={setPlantCode}
          className="w-1/2 self-end"
          align="right"
        />

        <StpHeaderCard stp={stp} plantCode={selectedPlant?.plantCode} showPenalty={false} />

        <Card className="p-[15px]">
          <DateRangeField value={range} onChange={setRange} className="ml-auto w-[54%]" />

          <div className="mt-[15px]">
            <ComplianceTab
              plantCode={selectedPlant?.plantCode}
              exportLabel={
                (selectedPlant?.stpId && stpDetails[selectedPlant.stpId]?.name) ||
                selectedPlant?.label ||
                stp.name
              }
              dateRangeLabel={range}
            />
          </div>
        </Card>
      </div>
    </ExportMetaProvider>
  )
}
