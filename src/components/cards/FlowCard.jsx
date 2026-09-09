import Card from '../ui/Card'
import CardTitle from '../ui/CardTitle'
import FlowBeaker from '../illustrations/FlowBeaker'

function Metric({ label, value, tone }) {
  return (
    <div>
      <p className="text-[12.5px] font-medium leading-4 text-ink-soft">{label}</p>
      <p className={`mt-[5px] text-[15px] font-bold leading-5 ${tone === 'orange' ? 'text-orange' : 'text-navy'}`}>
        {value}
      </p>
    </div>
  )
}

export default function FlowCard({ data, variant }) {
  return (
    <Card className="p-[15px] pb-[18px]">
      <CardTitle>{data.title}</CardTitle>

      <div className="mt-[12px] flex items-center gap-[16px]">
        <FlowBeaker variant={variant} percent={data.fillPercent} id={`beaker-${variant}`} />

        <div className="flex-1 space-y-[19px]">
          <Metric label="Current Flow" value={data.currentFlow} tone="orange" />
          <Metric label="Capacity" value={data.capacity} />
          <Metric label="Current Occupancy" value={data.occupancy} />
        </div>
      </div>
    </Card>
  )
}
