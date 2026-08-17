import AppLayout from '@/layouts/AppLayout'
import { Card, StatesDropdown } from '@/components/ui'
import gaugeGreen from '@/assets/summary/gauge-green.svg'
import gaugeRed from '@/assets/summary/gauge-red.svg'
import gaugeYellow from '@/assets/summary/gauge-yellow.svg'
import warning from '@/assets/summary/warning.svg'
import flowChartArea from '@/assets/summary/flow-chart-area.svg'
import flowChartLine from '@/assets/summary/flow-chart-line.svg'
import flowChartGrid from '@/assets/summary/flow-chart-grid.svg'
import capacityGauge from '@/assets/summary/capacity-gauge.svg'
import tankInlet from '@/assets/summary/tank-inlet.svg'
import tankOutlet from '@/assets/summary/tank-outlet.svg'
import inletPipe from '@/assets/summary/inlet-pipe.png'
import outletTap from '@/assets/summary/outlet-tap.png'
import tooltip from '@/assets/summary/tooltip.svg'
import chevronSm from '@/assets/summary/chevron-sm.svg'
import boundsWeekly from '@/assets/summary/bounds-weekly.svg'

const offlineItems = Array.from({ length: 5 }, () => ({
  name: '68 MLD STP, Jagjeetpur, Haridwar',
  alerts: '150 Alerts',
}))

export default function Summary() {
  return (
    <AppLayout
      breadcrumbs={[
        { label: 'STP Monitoring' },
        { label: 'Summary', current: true },
      ]}
      toolbar={<StatesDropdown />}
    >
      <div className="flex flex-col gap-4">
        {/* Row 1: Total STPs + Flow chart */}
        <div className="flex gap-4">
          <Card className="relative h-[328px] w-[443px] shrink-0 overflow-clip rounded-[12px]">
            <p className="absolute left-4 top-[16px] text-[16px] font-semibold leading-5 text-[#646464]">
              Total STP&apos;s
            </p>

            {/* Semi-circular gauge — each arc clipped to its Figma inset region */}
            <div className="absolute left-[132px] top-[70px] size-[180px]">
              <div className="absolute inset-[0_30.52%_47.08%_0]">
                <img src={gaugeGreen} alt="" className="block size-full max-w-none" />
              </div>
              <div className="absolute inset-[5.16%_1.88%_60.79%_69.08%]">
                <img src={gaugeRed} alt="" className="block size-full max-w-none" />
              </div>
              <div className="absolute inset-[38.52%_0_47.8%_94.08%]">
                <img src={gaugeYellow} alt="" className="block size-full max-w-none" />
              </div>
            </div>

            <p className="absolute left-[206px] top-[124px] text-[24px] font-semibold leading-[22px] text-[#07121e]">
              42
            </p>

            {/* Legend rows — absolute positions from Figma */}
            <div className="absolute left-4 top-[208px] h-[29px] w-[5px] rounded-[20px] bg-[#11a33e]" />
            <p className="absolute left-[40px] top-[211px] text-[14px] font-medium leading-[22px] text-[#646464]">
              Online STP&apos;s
            </p>
            <p className="absolute left-[248px] top-[211px] text-[14px] font-semibold leading-[22px] text-[#11a33e]">
              37
            </p>
            <p className="absolute right-4 top-[211px] text-right text-[14px] font-semibold leading-[22px] text-[#07121e]">
              88%
            </p>

            <div className="absolute left-4 top-[245px] h-[29px] w-[5px] rounded-[20px] bg-[#dc2626]" />
            <p className="absolute left-[40px] top-[249px] text-[14px] font-medium leading-[22px] text-[#646464]">
              Offline STP&apos;s
            </p>
            <p className="absolute left-[248px] top-[249px] text-[14px] font-semibold leading-[22px] text-[#dc2626]">
              4
            </p>
            <p className="absolute right-4 top-[249px] text-right text-[14px] font-semibold leading-[22px] text-[#07121e]">
              9%
            </p>

            <div className="absolute left-4 top-[282px] h-[29px] w-[5px] rounded-[20px] bg-[#f9ae01]" />
            <p className="absolute left-[40px] top-[287px] text-[14px] font-medium leading-[22px] text-[#646464]">
              Delay STP&apos;s
            </p>
            <p className="absolute left-[248px] top-[287px] text-[14px] font-semibold leading-[22px] text-[#f9ae01]">
              1
            </p>
            <p className="absolute right-4 top-[287px] text-right text-[14px] font-semibold leading-[22px] text-[#07121e]">
              3%
            </p>
          </Card>

          <Card className="relative h-[328px] min-w-0 flex-1 overflow-clip rounded-[12px]">
            {/* Title */}
            <p className="absolute left-4 top-6 whitespace-nowrap text-[16px] font-semibold leading-5 text-[#646464]">
              Inlet vs Outlet Flow{' '}
              <span className="text-[14px] font-medium text-[#7e7e7e]">(MLD)</span>
            </p>

            {/* Weekly dropdown */}
            <div className="absolute inset-[4.88%_2.71%_84.14%_67.84%]">
              <img src={boundsWeekly} alt="" className="absolute inset-0 size-full" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-medium leading-6 text-[#646464]">
                Weekly
              </span>
              <img
                src={chevronSm}
                alt=""
                className="absolute right-2 top-1/2 size-4 -translate-y-1/2"
              />
            </div>

            {/* Green area + line (inlet) */}
            <div className="absolute inset-[32.63%_2.71%_12.68%_9.18%]">
              <img src={flowChartArea} alt="" className="absolute inset-0 size-full" />
            </div>

            {/* Grid lines */}
            <div className="absolute inset-[24.6%_2.71%_12.6%_9.18%]">
              <img src={flowChartGrid} alt="" className="absolute inset-0 size-full" />
            </div>

            {/* Blue area + line (outlet) */}
            <div className="absolute inset-[49.9%_2.71%_12.68%_9.18%]">
              <img src={flowChartLine} alt="" className="absolute inset-0 size-full" />
            </div>

            {/* Tooltip badge */}
            <div className="absolute inset-[41.37%_57.03%_50.1%_37.94%]">
              <img src={tooltip} alt="" className="absolute inset-0 size-full" />
            </div>
            <p className="absolute left-[38.61%] top-[calc(50%-26px)] text-[12px] font-medium text-white">
              900
            </p>

            {/* Y-axis labels */}
            <p className="absolute left-[2.37%] top-[calc(50%-87px)] text-right text-[12px] font-medium leading-[9px] text-[#646464]">
              1500
            </p>
            <p className="absolute left-[2.37%] top-[calc(50%-46px)] text-right text-[12px] font-medium leading-[9px] text-[#646464]">
              1200
            </p>
            <p className="absolute left-[2.71%] top-[calc(50%-5px)] text-right text-[12px] font-medium leading-[9px] text-[#646464]">
              900
            </p>
            <p className="absolute left-[2.71%] top-[calc(50%+36px)] text-right text-[12px] font-medium leading-[9px] text-[#646464]">
              600
            </p>
            <p className="absolute left-[3.4%] top-[calc(50%+77px)] text-right text-[12px] font-medium leading-[9px] text-[#646464]">
              300
            </p>
            <p className="absolute left-[5.63%] top-[calc(50%+118px)] text-[12px] font-medium leading-[9px] text-[#646464]">
              0
            </p>

            {/* X-axis labels */}
            <p className="absolute left-[9.18%] right-[84.56%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              1 May
            </p>
            <p className="absolute left-[23.5%] right-[70.06%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              2 May
            </p>
            <p className="absolute left-[37.94%] right-[55.43%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              3 May
            </p>
            <p className="absolute left-[52.56%] right-[40.81%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              4 May
            </p>
            <p className="absolute left-[67.22%] right-[26.34%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              5 May
            </p>
            <p className="absolute left-[81.69%] right-[12.98%] top-[calc(50%+139px)] text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              6 May
            </p>
            <p className="absolute left-[92.24%] right-[2.59%] top-[calc(50%+139px)] whitespace-nowrap text-center text-[12px] font-medium leading-[9px] text-[#646464]">
              7 May
            </p>
          </Card>
        </div>

        {/* Row 2: Capacity + Inlet + Outlet */}
        <div className="flex gap-4">
          <Card className="relative h-[276px] w-[371px] shrink-0 overflow-clip rounded-[12px]">
            <p className="absolute left-4 top-[16px] text-[16px] font-semibold leading-5 text-[#646464]">
              Capacity Utilization
            </p>
            <div className="absolute left-[73px] top-[57px] size-[200px]">
              <img src={capacityGauge} alt="" className="size-full" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3px]">
                <span className="text-[18px] font-semibold leading-normal text-[#07121e]">431 MLD</span>
                <span className="text-[16px] font-normal leading-normal text-[rgba(28,28,28,0.64)]">
                  Total
                </span>
              </div>
            </div>
          </Card>

          <Card className="relative h-[276px] w-[370px] shrink-0 overflow-clip rounded-[12px]">
            <p className="absolute left-4 top-[17px] text-[16px] font-semibold leading-5 text-[#646464]">
              Total Inlet Flow
            </p>
            <div className="absolute left-[42px] top-[61px] h-[200px] w-[140px]">
              <img src={tankInlet} alt="" className="size-full" />
            </div>
            <div className="absolute left-[5px] top-[84px] h-[69px] w-[102px] overflow-hidden">
              <img
                src={inletPipe}
                alt=""
                className="absolute left-[-0.62%] top-[2.15%] h-full w-[101.25%] max-w-none"
              />
            </div>
            <p className="absolute left-[calc(50%-99px)] top-[215px] text-[16px] font-semibold text-white">
              78.5%
            </p>
            <FlowStats flow="7246.5 m³/hr" />
          </Card>

          <Card className="relative h-[276px] min-w-0 flex-1 overflow-clip rounded-[12px]">
            <p className="absolute left-4 top-4 text-[16px] font-semibold leading-5 text-[#646464]">
              Total Outlet Flow
            </p>
            <div className="absolute left-4 top-[60px] h-[200px] w-[140px]">
              <img src={tankOutlet} alt="" className="size-full" />
            </div>
            <div className="absolute left-[153px] top-[91px] h-[109px] w-20 overflow-hidden">
              <img
                src={outletTap}
                alt=""
                className="absolute left-[-36%] top-0 h-full w-[136%] max-w-none"
              />
            </div>
            <p className="absolute left-[calc(50%-120px)] top-[214px] text-[16px] font-semibold text-white">
              78.5%
            </p>
            <FlowStats flow="9082.7 m³/hr" />
          </Card>
        </div>

        {/* Row 3: Offline STPs — full width */}
        <Card className="relative h-[368px] w-full overflow-clip rounded-[12px]">
          <p className="absolute left-4 top-4 text-[16px] font-semibold leading-5 text-[#646464]">
            Offline STP&apos;s
          </p>
          <div className="absolute left-4 right-4 top-[60px] flex flex-col gap-2">
            {offlineItems.map((item, i) => (
              <div
                key={i}
                className="flex h-[52px] items-center gap-5 rounded-lg bg-[#fff4f4] px-4"
              >
                <img src={warning} alt="" className="size-5 shrink-0" />
                <span className="flex-1 text-[14px] font-medium leading-[22px] text-[#07121e]">
                  {item.name}
                </span>
                <span className="shrink-0 text-[14px] font-medium leading-[22px] text-[#dc2626]">
                  {item.alerts}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}

function FlowStats({ flow }: { flow: string }) {
  return (
    <>
      <p className="absolute left-[206px] top-[73px] text-[14px] font-medium leading-[22px] text-[#7e7e7e]">
        Current Flow
      </p>
      <p className="absolute left-[206px] top-[99px] text-[16px] font-semibold leading-[22px] text-[#f69a30]">
        {flow}
      </p>
      <p className="absolute left-[206px] top-[137px] text-[14px] font-medium leading-[22px] text-[#7e7e7e]">
        Capacity
      </p>
      <p className="absolute left-[206px] top-[163px] text-[16px] font-semibold leading-[22px] text-[#0768d2]">
        10,000 KL
      </p>
      <p className="absolute left-[206px] top-[201px] text-[14px] font-medium leading-[22px] text-[#7e7e7e]">
        Current Occupancy
      </p>
      <p className="absolute left-[206px] top-[227px] text-[16px] font-semibold leading-[22px] text-[#0768d2]">
        7,850 KL
      </p>
    </>
  )
}
