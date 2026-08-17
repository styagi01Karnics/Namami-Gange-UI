import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import UserActions from '@/components/UserActions'
import {
  defaultStpDisplayData,
  fetchStpSiteInfo,
  type ParameterReading,
  type StpDisplayData,
} from '@/api/stpSiteInfo'
import img6675A0F9048C9949Ebc0580Dd3Bc576C1 from '@/assets/current-parameter/asset-0.png'
import imgFb60F882C22C525A84753C16E4C4F14F1 from '@/assets/current-parameter/asset-1.png'
import imgShape from '@/assets/current-parameter/asset-4.svg'
import imgGroup30 from '@/assets/current-parameter/asset-5.svg'
import imgEllipse3713 from '@/assets/current-parameter/asset-6.svg'
import imgEllipse3714 from '@/assets/current-parameter/asset-7.svg'
import imgGroup64 from '@/assets/current-parameter/asset-8.svg'
import imgGroup65 from '@/assets/current-parameter/asset-9.svg'
import imgBounds from '@/assets/current-parameter/asset-16.svg'
import imgBounds1 from '@/assets/current-parameter/asset-17.svg'
import imgShape4 from '@/assets/current-parameter/asset-18.svg'
import imgShape5 from '@/assets/current-parameter/asset-19.svg'
import imgShape6 from '@/assets/current-parameter/asset-20.svg'
import imgShape7 from '@/assets/current-parameter/asset-21.svg'
import imgShape8 from '@/assets/current-parameter/asset-22.svg'
import imgShape9 from '@/assets/current-parameter/asset-23.svg'
import imgShape10 from '@/assets/current-parameter/asset-24.svg'
import imgShape11 from '@/assets/current-parameter/asset-25.svg'
import imgShape12 from '@/assets/current-parameter/asset-26.svg'
import imgShape13 from '@/assets/current-parameter/asset-27.svg'
import imgShape14 from '@/assets/current-parameter/asset-28.svg'
import imgShape15 from '@/assets/current-parameter/asset-29.svg'
import imgShape16 from '@/assets/current-parameter/asset-30.svg'
import imgShape17 from '@/assets/current-parameter/asset-31.svg'
import imgShape18 from '@/assets/current-parameter/asset-32.svg'
import imgShape19 from '@/assets/current-parameter/asset-33.svg'
import imgShape20 from '@/assets/current-parameter/asset-34.svg'
import imgShape21 from '@/assets/current-parameter/asset-35.svg'
import imgShape22 from '@/assets/current-parameter/asset-36.svg'
import imgShape23 from '@/assets/current-parameter/asset-37.svg'
import imgShape24 from '@/assets/current-parameter/asset-38.svg'
import imgShape25 from '@/assets/current-parameter/asset-39.svg'
import imgShape26 from '@/assets/current-parameter/asset-40.svg'
import imgShape27 from '@/assets/current-parameter/asset-41.svg'
import imgShape28 from '@/assets/current-parameter/asset-42.svg'
import imgShape29 from '@/assets/current-parameter/asset-43.svg'
import imgShape30 from '@/assets/current-parameter/asset-44.svg'
import imgBounds2 from '@/assets/current-parameter/asset-45.svg'
import imgShape31 from '@/assets/current-parameter/asset-46.svg'

function valueColor(reading: ParameterReading) {
  return reading.isAlert ? 'text-[#dc2626]' : 'text-[#07121e]'
}

function TableOverflowCell({
  value,
  top,
  left,
  width,
  lines = 2,
}: {
  value: string
  top: string
  left: string
  width: string
  lines?: 1 | 2
}) {
  const clampClass =
    lines === 1 ? 'truncate whitespace-nowrap' : 'line-clamp-2 break-words whitespace-normal'

  return (
    <p
      className={`absolute overflow-hidden font-['SF_Pro:Medium'] font-[510] text-[14px] leading-[22px] text-[#07121e] ${clampClass}`}
      style={{ top, left, width, fontVariationSettings: '"wdth" 100' }}
      title={value}
    >
      {value}
    </p>
  )
}

export default function CurrentParameter() {
  const [data, setData] = useState<StpDisplayData>(defaultStpDisplayData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [detailsExpanded, setDetailsExpanded] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadStpData() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetchStpSiteInfo()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load STP data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStpData()
    return () => {
      cancelled = true
    }
  }, [])

  const d = data

  return (
    <div className="relative min-h-screen w-full overflow-x-auto bg-[#f4faff]" data-node-id="44:2920" data-name="Current Parameter E">
      <div className="absolute top-0 left-0 z-20 h-full min-h-screen">
        <Sidebar />
      </div>
      <div className="absolute right-6 top-8 z-30">
        <UserActions />
      </div>
      {(loading || error) && (
        <div className="absolute left-[281px] top-[72px] z-40 rounded-[8px] border border-[#d8edff] bg-white px-4 py-2 text-[12px] font-medium shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
          {loading ? 'Loading STP data...' : error}
        </div>
      )}
      <div className="absolute content-stretch flex gap-[var(--horizontal\/none,0px)] inset-[2.17%_70.28%_95.66%_19.72%] items-start" data-node-id="44:2981" data-name="Breadcrumb">
        <div className="content-stretch flex gap-[var(--horizontal\/none,0px)] items-center relative shrink-0" data-node-id="I44:2981;9077:5944" data-name=".Breadcrumb Item">
          <div className="bg-[var(--SubtleBackground.Rest,rgba(255,255,255,0))] content-stretch flex gap-[var(--horizontal\/xs,4px)] items-center justify-center px-[var(--horizontal\/s,8px)] py-[var(--vertical\/s,8px)] relative rounded-[var(--button\/container,4px)] shrink-0" data-node-id="I44:2981;9077:5944;9077:5806" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacingHorizontalXS,4px)] h-[24px] items-center justify-center relative shrink-0" data-node-id="I44:2981;9077:5944;9077:5806;9026:533" data-name="Container">
              <div className="content-stretch flex items-start pb-[var(--spacingVerticalXXS,2px)] relative shrink-0" data-node-id="I44:2981;9077:5944;9077:5806;9026:534" data-name="Text wrapper for offset">
                <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#646464] text-[length:var(--typography\/font-size\/400,16px)] whitespace-nowrap" data-node-id="I44:2981;9077:5944;9077:5806;9026:535" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[var(--typography\/line-height\/400,22px)]">STP Monitoring</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center relative shrink-0" data-node-id="I44:2981;9077:5944;9077:5807" data-name="Divider">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="I44:2981;9077:5944;9077:5808" data-name="Chevron">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12.001px] left-[calc(50%+0.75px)] top-1/2 w-[6.499px]" data-node-id="I44:2981;9077:5944;9077:5808;68174:581" data-name="Shape">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[var(--horizontal\/none,0px)] items-center relative shrink-0" data-node-id="I44:2981;9077:5953" data-name=".Breadcrumb Item">
          <div className="bg-[var(--SubtleBackground.Rest,rgba(255,255,255,0))] content-stretch flex gap-[var(--horizontal\/xs,4px)] items-center justify-center px-[var(--horizontal\/s,8px)] py-[var(--vertical\/s,8px)] relative rounded-[var(--button\/container,4px)] shrink-0" data-node-id="I44:2981;9077:5953;9077:5830" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacingHorizontalXS,4px)] h-[24px] items-center justify-center relative shrink-0" data-node-id="I44:2981;9077:5953;9077:5830;9026:533" data-name="Container">
              <div className="content-stretch flex items-start pb-[var(--spacingVerticalXXS,2px)] relative shrink-0" data-node-id="I44:2981;9077:5953;9077:5830;9026:534" data-name="Text wrapper for offset">
                <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Semibold'] font-[590] justify-center leading-[0] relative shrink-0 text-[#07121e] text-[length:var(--typography\/font-size\/400,16px)] whitespace-nowrap" data-node-id="I44:2981;9077:5953;9077:5830;9026:535" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[var(--typography\/line-height\/400,22px)]">Current Parameter</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-white h-[276px] left-[281px] overflow-clip rounded-[12px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] top-[97px] w-[371px]" data-node-id="54:3733">
        <div className="absolute content-stretch flex gap-[108px] items-start left-[16px] top-[16px] w-[157px]" data-node-id="54:3734">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[20px] relative shrink-0 text-[#646464] text-[16px] whitespace-nowrap" data-node-id="54:3735" style={{ fontVariationSettings: '"wdth" 100' }}>
            Total Stations
          </p>
        </div>
        <div className="-translate-x-1/2 absolute content-stretch flex flex-col h-[126.077px] items-center justify-center left-[calc(50%-3.5px)] top-[62.87px] w-[220px]" data-node-id="70:254">
          <div className="h-[93.923px] relative shrink-0 w-[187.846px]" data-node-id="70:255">
            <div className="absolute inset-[-16.95%_-8.47%_-0.28%_-8.47%]">
              <img alt="" className="block max-w-none size-full" src={imgGroup30} />
            </div>
          </div>
          <div className="-translate-x-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[69.38px]" data-node-id="70:260">
            <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[24.538px] relative shrink-0 text-[#003c7a] text-[24px] text-center whitespace-nowrap" data-node-id="70:261" style={{ fontVariationSettings: '"wdth" 100' }}>
              26
            </p>
          </div>
        </div>
        <div className="absolute left-[37px] size-[13px] top-[209px]" data-node-id="73:343">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3713} />
        </div>
        <div className="absolute left-[37px] size-[13px] top-[243px]" data-node-id="73:346">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse3714} />
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[70px] text-[#7e7e7e] text-[14px] top-[204px] whitespace-nowrap" data-node-id="73:344" style={{ fontVariationSettings: '"wdth" 100' }}>
          Inlet STP’s
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[70px] text-[#7e7e7e] text-[14px] top-[238px] whitespace-nowrap" data-node-id="73:347" style={{ fontVariationSettings: '"wdth" 100' }}>
          Outlet STP’s
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[306px] text-[#0768d2] text-[16px] top-[204px] whitespace-nowrap" data-node-id="73:345" style={{ fontVariationSettings: '"wdth" 100' }}>
          13
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[306px] text-[#0768d2] text-[16px] top-[238px] whitespace-nowrap" data-node-id="73:348" style={{ fontVariationSettings: '"wdth" 100' }}>
          13
        </p>
      </div>
      <div className="absolute bg-white h-[276px] left-[668px] overflow-clip rounded-[12px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] top-[97px] w-[370px]" data-node-id="70:473">
        <div className="absolute content-stretch flex gap-[108px] items-start left-[16px] top-[16px] w-[157px]" data-node-id="70:474">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[20px] relative shrink-0 text-[#646464] text-[16px] whitespace-nowrap" data-node-id="70:475" style={{ fontVariationSettings: '"wdth" 100' }}>
            Total Inlet Flow
          </p>
        </div>
        <div className="absolute h-[200px] left-[42px] top-[60px] w-[140px]" data-node-id="72:319">
          <div className="absolute inset-[-2.5%_-4.29%_-3.5%_-4.29%]">
            <img alt="" className="block max-w-none size-full" src={imgGroup64} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[72px] whitespace-nowrap" data-node-id="72:320" style={{ fontVariationSettings: '"wdth" 100' }}>
          Current Flow
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[136px] whitespace-nowrap" data-node-id="72:322" style={{ fontVariationSettings: '"wdth" 100' }}>
          Capacity
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[200px] whitespace-nowrap" data-node-id="72:324" style={{ fontVariationSettings: '"wdth" 100' }}>
          Current Occupancy
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#f69a30] text-[16px] top-[98px] whitespace-nowrap" data-node-id="72:321" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.totalInletFlow}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[calc(50%-99px)] text-[16px] text-white top-[214px] whitespace-nowrap" data-node-id="72:326" style={{ fontVariationSettings: '"wdth" 100' }}>
          78.5%
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#0768d2] text-[16px] top-[162px] whitespace-nowrap" data-node-id="72:323" style={{ fontVariationSettings: '"wdth" 100' }}>
          10,000 KL
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#0768d2] text-[16px] top-[226px] whitespace-nowrap" data-node-id="72:325" style={{ fontVariationSettings: '"wdth" 100' }}>
          7,850 KL
        </p>
        <div className="absolute h-[69px] left-[5px] top-[83px] w-[102px]" data-node-id="132:763" data-name="6675a0f9048c9949ebc0580dd3bc576c 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-0.62%] max-w-none top-[2.15%] w-[101.25%]" src={img6675A0F9048C9949Ebc0580Dd3Bc576C1} />
          </div>
        </div>
      </div>
      <div className="absolute bg-white h-[276px] left-[1054px] overflow-clip rounded-[12px] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] top-[97px] w-[362px]" data-node-id="70:491">
        <div className="absolute content-stretch flex gap-[108px] items-start left-[16px] top-[16px] w-[157px]" data-node-id="70:492">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[20px] relative shrink-0 text-[#646464] text-[16px] whitespace-nowrap" data-node-id="70:493" style={{ fontVariationSettings: '"wdth" 100' }}>
            Total Outlet Flow
          </p>
        </div>
        <div className="absolute h-[200px] left-[16px] top-[60px] w-[140px]" data-node-id="73:327">
          <div className="absolute inset-[-2.5%_-4.29%_-3.5%_-4.29%]">
            <img alt="" className="block max-w-none size-full" src={imgGroup65} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[72px] whitespace-nowrap" data-node-id="73:331" style={{ fontVariationSettings: '"wdth" 100' }}>
          Current Flow
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[136px] whitespace-nowrap" data-node-id="73:332" style={{ fontVariationSettings: '"wdth" 100' }}>
          Capacity
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[206px] text-[#7e7e7e] text-[14px] top-[200px] whitespace-nowrap" data-node-id="73:333" style={{ fontVariationSettings: '"wdth" 100' }}>
          Current Occupancy
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#f69a30] text-[16px] top-[98px] whitespace-nowrap" data-node-id="73:334" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.totalOutletFlow}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[calc(50%-120px)] text-[16px] text-white top-[214px] whitespace-nowrap" data-node-id="73:335" style={{ fontVariationSettings: '"wdth" 100' }}>
          78.5%
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#0768d2] text-[16px] top-[162px] whitespace-nowrap" data-node-id="73:336" style={{ fontVariationSettings: '"wdth" 100' }}>
          10,000 KL
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[206px] text-[#0768d2] text-[16px] top-[226px] whitespace-nowrap" data-node-id="73:337" style={{ fontVariationSettings: '"wdth" 100' }}>
          7,850 KL
        </p>
        <div className="absolute h-[109px] left-[153px] top-[91px] w-[80px]" data-node-id="133:765" data-name="fb60f882c22c525a84753c16e4c4f14f 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-full left-[-36.25%] max-w-none top-0 w-[136.25%]" src={imgFb60F882C22C525A84753C16E4C4F14F1} />
          </div>
        </div>
      </div>
      <div
        className={`absolute left-[281px] top-[389px] w-[1135px] overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)] transition-[height] duration-200 ${
          detailsExpanded ? 'h-[976px]' : 'h-[296px]'
        }`}
        data-node-id="210:1407"
      >
        <div className="absolute inset-[2.46%_21.23%_93.85%_61.23%]" data-node-id="210:1408" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds} />
        </div>
        <div className="absolute inset-[2.46%_1.41%_93.85%_80.18%]" data-node-id="210:1409" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds1} />
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[24px] left-[704px] text-[#646464] text-[12px] top-[30px] whitespace-nowrap" data-node-id="210:1410" style={{ fontVariationSettings: '"wdth" 100' }}>
          All States
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[24px] left-[920px] text-[#646464] text-[12px] top-[30px] whitespace-nowrap" data-node-id="210:1411" style={{ fontVariationSettings: '"wdth" 100' }}>
          All STPs
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+308.5px)] overflow-clip size-[16px] top-[calc(50%-446px)]" data-node-id="210:1412" data-name="Chevron">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[5.5px] left-1/2 top-[calc(50%+0.25px)] w-[10px]" data-node-id="I210:1412;14962:9874" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape4} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+531.5px)] overflow-clip size-[16px] top-[calc(50%-446px)]" data-node-id="210:1413" data-name="Chevron">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[5.5px] left-1/2 top-[calc(50%+0.25px)] w-[10px]" data-node-id="I210:1413;14962:9874" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape4} />
          </div>
        </div>
        <div className="absolute bg-[#f5f5f5] h-[54px] left-0 top-[84px] w-[1135px]" data-node-id="210:1414" />
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[85px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1415" style={{ fontVariationSettings: '"wdth" 100' }}>
          STP
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[16px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1416" style={{ fontVariationSettings: '"wdth" 100' }}>
          S.No.
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[334px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1417" style={{ fontVariationSettings: '"wdth" 100' }}>
          Address
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[625px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1418" style={{ fontVariationSettings: '"wdth" 100' }}>
          Inlet (m³/hr)
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[742px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1419" style={{ fontVariationSettings: '"wdth" 100' }}>
          Outlet (m³/hr)
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[868px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1420" style={{ fontVariationSettings: '"wdth" 100' }}>
          Timestamp
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[1072px] text-[#7e7e7e] text-[14px] top-[100px] whitespace-nowrap" data-node-id="210:1421" style={{ fontVariationSettings: '"wdth" 100' }}>
          Details
        </p>
        <a className="absolute bg-white block border border-[#d8edff] border-solid cursor-pointer h-[79px] left-[-1px] top-[138px] w-[1137px]" data-node-id="210:1422" />
        {detailsExpanded && (
          <div className="absolute bg-white border border-[#d8edff] border-solid h-[725px] left-0 top-[216px] w-[1136px]" data-node-id="210:1425" />
        )}
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[16px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1426" style={{ fontVariationSettings: '"wdth" 100' }}>
          1
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[17px] text-[#07121e] text-[14px] top-[245px] whitespace-nowrap" data-node-id="210:1429" style={{ fontVariationSettings: '"wdth" 100' }}>
          2
        </p>
        <a className="[word-break:break-word] absolute block cursor-pointer font-['SF_Pro:Medium'] font-[510] leading-[0] left-[85px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1430" style={{ fontVariationSettings: '"wdth" 100' }}>
          <p className="leading-[22px]">14 MLD STP, Sarai, Haridwar</p>
        </a>
        <TableOverflowCell value={d.stpName} top="245px" left="86px" width="230px" />
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[334px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1434" style={{ fontVariationSettings: '"wdth" 100' }}>
          Haridwar, Uttarakhand, 249401, India
        </p>
        <TableOverflowCell value={d.address} top="245px" left="335px" width="280px" />
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[625px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1438" style={{ fontVariationSettings: '"wdth" 100' }}>
          892.00
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[626px] text-[#07121e] text-[14px] top-[245px] whitespace-nowrap" data-node-id="210:1441" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.inletFlow}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[745px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1442" style={{ fontVariationSettings: '"wdth" 100' }}>
          748.83
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[746px] text-[#07121e] text-[14px] top-[245px] whitespace-nowrap" data-node-id="210:1445" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.outletFlow}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[871px] text-[#07121e] text-[14px] top-[167px] whitespace-nowrap" data-node-id="210:1446" style={{ fontVariationSettings: '"wdth" 100' }}>
          19 May 2026, 05:30 PM
        </p>
        <TableOverflowCell value={d.timestamp} top="245px" left="872px" width="195px" lines={1} />
        <div className="absolute bg-[var(--SubtleBackground.Selected,#ebebeb)] content-stretch flex items-center justify-center left-[1079px] px-[var(--spacingHorizontalSNudge,6px)] py-[var(--spacingVerticalSNudge,6px)] rounded-[var(--button\/container,4px)] top-[162px]" data-node-id="210:1450" data-name="Button">
          <div className="content-stretch flex gap-[var(--spacingHorizontalXS,4px)] items-center justify-center relative shrink-0" data-node-id="210:1451" data-name="Container">
            <div className="overflow-clip relative shrink-0 size-[20px]" data-node-id="210:1452" data-name="Chevron">
              <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[6.501px] left-1/2 top-[calc(50%+0.75px)] w-[12.001px]" data-node-id="I210:1452;14962:9870" data-name="Shape">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape5} />
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-expanded={detailsExpanded}
          aria-label={detailsExpanded ? 'Collapse STP details' : 'Expand STP details'}
          onClick={() => setDetailsExpanded((prev) => !prev)}
          className="absolute left-[1080px] top-[240px] flex cursor-pointer items-center justify-center rounded-[4px] bg-[var(--SubtleBackground.Selected,#ebebeb)] px-[6px] py-[6px]"
          data-node-id="210:1462"
          data-name="Button"
        >
          <div className="relative size-[20px] overflow-clip" data-node-id="210:1464" data-name="Chevron">
            <div
              className={`absolute left-1/2 top-1/2 h-[6.501px] w-[12.001px] -translate-x-1/2 -translate-y-1/2 ${
                detailsExpanded ? 'top-[calc(50%-0.75px)]' : 'top-[calc(50%+0.75px)]'
              }`}
              data-node-id="I210:1464;14962:9798"
              data-name="Shape"
            >
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={detailsExpanded ? imgShape6 : imgShape5}
              />
            </div>
          </div>
        </button>
        {detailsExpanded && (
          <>
        <div className="absolute bg-[#f4f8fe] h-[604px] left-[16px] rounded-[16px] top-[313px] w-[542px]" data-node-id="210:1469" />
        <div className="absolute bg-[#f8fcf9] h-[604px] left-[578px] rounded-[16px] top-[313px] w-[542px]" data-node-id="210:1470" />
        <div className="absolute bg-[#0768d2] h-[68px] left-[16px] rounded-tl-[16px] rounded-tr-[16px] top-[313px] w-[542px]" data-node-id="210:1471" />
        <div className="absolute bg-[#168e3f] h-[68px] left-[578px] rounded-tl-[16px] rounded-tr-[16px] top-[313px] w-[542px]" data-node-id="210:1472" />
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[72px] text-[16px] text-white top-[323px] whitespace-nowrap" data-node-id="210:1473" style={{ fontVariationSettings: '"wdth" 100' }}>
          Influent
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[634px] text-[16px] text-white top-[323px] whitespace-nowrap" data-node-id="210:1474" style={{ fontVariationSettings: '"wdth" 100' }}>
          Effluent
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Regular'] font-normal leading-[22px] left-[72px] text-[14px] text-white top-[349px] whitespace-nowrap" data-node-id="210:1475" style={{ fontVariationSettings: '"wdth" 100' }}>
          Incoming (Raw Water)
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Regular'] font-normal leading-[22px] left-[634px] text-[14px] text-white top-[349px] whitespace-nowrap" data-node-id="210:1476" style={{ fontVariationSettings: '"wdth" 100' }}>
          Treated (Outgoing Water)
        </p>
        <div className="absolute bg-white left-[28px] opacity-80 rounded-[4px] size-[32px] top-[331px]" data-node-id="210:1477" />
        <div className="absolute bg-white left-[590px] opacity-80 rounded-[4px] size-[32px] top-[331px]" data-node-id="210:1478" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-523.5px)] overflow-clip size-[20px] top-[calc(50%-141px)]" data-node-id="210:1479" data-name="Arrow Forward">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12.5px] left-1/2 top-[calc(50%-0.25px)] w-[16px]" data-node-id="I210:1479;14992:2068" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape7} />
          </div>
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[385px] text-[14px] text-white top-[336px] whitespace-nowrap" data-node-id="210:1480" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.timestamp}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[947px] text-[14px] text-white top-[336px] whitespace-nowrap" data-node-id="210:1481" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.timestamp}
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-200.5px)] overflow-clip size-[20px] top-[calc(50%-141px)]" data-node-id="210:1482" data-name="History">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15px] top-1/2" data-node-id="I210:1482;14992:19264" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape8} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+361.5px)] overflow-clip size-[20px] top-[calc(50%-141px)]" data-node-id="210:1483" data-name="History">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15px] top-1/2" data-node-id="I210:1483;14992:19264" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape8} />
          </div>
        </div>
        <div className="absolute content-stretch flex gap-[108px] items-start left-[28px] top-[397px] w-[94px]" data-node-id="210:1484">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[22px] relative shrink-0 text-[#646464] text-[16px] whitespace-nowrap" data-node-id="210:1485" style={{ fontVariationSettings: '"wdth" 100' }}>
            Total Flow
          </p>
        </div>
        <div className="absolute content-stretch flex gap-[108px] items-start left-[590px] top-[397px] w-[94px]" data-node-id="210:1487">
          <p className="[word-break:break-word] font-['SF_Pro:Semibold'] font-[590] leading-[22px] relative shrink-0 text-[#646464] text-[16px] whitespace-nowrap" data-node-id="210:1488" style={{ fontVariationSettings: '"wdth" 100' }}>
            Total Flow
          </p>
        </div>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[28px] text-[#07121e] text-[20px] top-[429px] whitespace-nowrap" data-node-id="210:1490" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.totalFlow}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Semibold'] font-[590] leading-[22px] left-[590px] text-[#07121e] text-[20px] top-[429px] whitespace-nowrap" data-node-id="210:1491" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.totalFlow}
        </p>
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[28px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1492" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[590px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1493" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[28px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1494" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[292px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1691" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[854px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1729" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[28px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1658" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[590px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1730" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[160px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1720" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[722px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1731" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[590px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1495" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[160px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1496" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[722px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1497" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[159.5px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1498" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[721.5px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1732" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[423.5px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1692" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[985.5px] rounded-[8px] top-[621px] w-[123.5px]" data-node-id="210:1733" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[292.5px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1659" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[854.5px] rounded-[8px] top-[767px] w-[123.5px]" data-node-id="210:1734" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[291.5px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1502" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[855px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1503" />
        <div className="absolute bg-[#f4f9fe] border border-[#e4eefa] border-solid h-[138px] left-[423px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1504" />
        <div className="absolute bg-[#f8fcfa] border border-[#eaf3ec] border-solid h-[138px] left-[987px] rounded-[8px] top-[475px] w-[123.5px]" data-node-id="210:1505" />
        <div className="absolute bg-[#ebf4fe] left-[40px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1506" />
        <div className="absolute bg-[#e9f4ff] left-[602px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1507" />
        <div className="absolute bg-[#ebf4fe] left-[40px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1508" />
        <div className="absolute bg-[#ebf4fe] left-[304px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1693" />
        <div className="absolute bg-[#e5ffee] left-[866px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1735" />
        <div className="absolute bg-[#ebf4fe] left-[40px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1661" />
        <div className="absolute bg-[#e5ffee] left-[602px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1736" />
        <div className="absolute bg-[#ebf4fe] left-[172px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1721" />
        <div className="absolute bg-[#e5ffee] left-[734px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1737" />
        <div className="absolute bg-[#e5ffee] left-[602px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1509" />
        <div className="absolute bg-[#ebf4fe] left-[172px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1510" />
        <div className="absolute bg-[#e5ffee] left-[734px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1511" />
        <div className="absolute bg-[#ebf4fe] left-[172px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1512" />
        <div className="absolute bg-[#e5ffee] left-[734px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1738" />
        <div className="absolute bg-[#ebf4fe] left-[436px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1694" />
        <div className="absolute bg-[#e5ffee] left-[998px] opacity-80 rounded-[4px] size-[32px] top-[633px]" data-node-id="210:1739" />
        <div className="absolute bg-[#ebf4fe] left-[305px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1662" />
        <div className="absolute bg-[#e5ffee] left-[867px] opacity-80 rounded-[4px] size-[32px] top-[779px]" data-node-id="210:1740" />
        <div className="absolute bg-[#ebf4fe] left-[305px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1516" />
        <div className="absolute bg-[#e5ffee] left-[867px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1517" />
        <div className="absolute bg-[#ebf4fe] left-[437px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1518" />
        <div className="absolute bg-[#e5ffee] left-[999px] opacity-80 rounded-[4px] size-[32px] top-[487px]" data-node-id="210:1519" />
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1520" style={{ fontVariationSettings: '"wdth" 100' }}>
          pH
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[602px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1521" style={{ fontVariationSettings: '"wdth" 100' }}>
          pH
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1522" style={{ fontVariationSettings: '"wdth" 100' }}>
          NH₄-N
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[0] left-[304px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1695" style={{ fontVariationSettings: '"wdth" 100' }}>
          <span className="leading-[22px]">N0</span>
          <span className="leading-[22px]" style={{ fontVariationSettings: '"wdth" 100' }}>
            ₃
          </span>
          <span className="leading-[22px]">-N</span>
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[0] left-[866px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1741" style={{ fontVariationSettings: '"wdth" 100' }}>
          <span className="leading-[22px]">N0</span>
          <span className="leading-[22px]" style={{ fontVariationSettings: '"wdth" 100' }}>
            ₃
          </span>
          <span className="leading-[22px]">-N</span>
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[436px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1713" style={{ fontVariationSettings: '"wdth" 100' }}>
          Flow
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[998px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1742" style={{ fontVariationSettings: '"wdth" 100' }}>
          Flow
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1664" style={{ fontVariationSettings: '"wdth" 100' }}>
          Phosphorus
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[602px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1743" style={{ fontVariationSettings: '"wdth" 100' }}>
          Phosphorus
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1722" style={{ fontVariationSettings: '"wdth" 100' }}>
          TN
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1744" style={{ fontVariationSettings: '"wdth" 100' }}>
          TN
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[602px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1523" style={{ fontVariationSettings: '"wdth" 100' }}>
          NH₄
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1526" style={{ fontVariationSettings: '"wdth" 100' }}>
          BOD
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1527" style={{ fontVariationSettings: '"wdth" 100' }}>
          BOD
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1528" style={{ fontVariationSettings: '"wdth" 100' }}>
          Temp.
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[#646464] text-[14px] top-[673px] whitespace-nowrap" data-node-id="210:1745" style={{ fontVariationSettings: '"wdth" 100' }}>
          Temp.
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[305px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1666" style={{ fontVariationSettings: '"wdth" 100' }}>
          Totalizer
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[867px] text-[#646464] text-[14px] top-[819px] whitespace-nowrap" data-node-id="210:1746" style={{ fontVariationSettings: '"wdth" 100' }}>
          Totalizer
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[305px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1532" style={{ fontVariationSettings: '"wdth" 100' }}>
          COD
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[867px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1533" style={{ fontVariationSettings: '"wdth" 100' }}>
          COD
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[437px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1534" style={{ fontVariationSettings: '"wdth" 100' }}>
          TSS
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[999px] text-[#646464] text-[14px] top-[527px] whitespace-nowrap" data-node-id="210:1535" style={{ fontVariationSettings: '"wdth" 100' }}>
          TSS
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.influent.ph)}`} data-node-id="210:1536" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.ph.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[601px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.effluent.ph)}`} data-node-id="210:1537" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.ph.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.influent.nh4)}`} data-node-id="210:1538" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.nh4.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[304px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.influent.no3)}`} data-node-id="210:1697" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.no3.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[866px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.effluent.no3)}`} data-node-id="210:1747" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.no3.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[436px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.influent.flow)}`} data-node-id="210:1714" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.flow.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[998px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.effluent.flow)}`} data-node-id="210:1748" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.flow.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[40px] text-[14px] top-[846px] whitespace-nowrap ${valueColor(d.influent.phosphorus)}`} data-node-id="210:1668" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.phosphorus.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[602px] text-[14px] top-[846px] whitespace-nowrap ${valueColor(d.effluent.phosphorus)}`} data-node-id="210:1749" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.phosphorus.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[14px] top-[846px] whitespace-nowrap ${valueColor(d.influent.tn)}`} data-node-id="210:1723" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.tn.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[14px] top-[846px] whitespace-nowrap ${valueColor(d.effluent.tn)}`} data-node-id="210:1750" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.tn.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[602px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.effluent.nh4)}`} data-node-id="210:1539" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.nh4.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.influent.bod)}`} data-node-id="210:1540" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.bod.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.effluent.bod)}`} data-node-id="210:1541" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.bod.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[172px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.influent.temp)}`} data-node-id="210:1542" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.temp.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[734px] text-[14px] top-[700px] whitespace-nowrap ${valueColor(d.effluent.temp)}`} data-node-id="210:1751" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.temp.value}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[305px] text-[#f69a30] text-[14px] top-[846px] whitespace-nowrap" data-node-id="210:1669" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.totalizer.value}
        </p>
        <p className="[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[867px] text-[#f69a30] text-[14px] top-[846px] whitespace-nowrap" data-node-id="210:1752" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.totalizer.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[305px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.influent.cod)}`} data-node-id="210:1544" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.cod.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[867px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.effluent.cod)}`} data-node-id="210:1545" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.cod.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[437px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.influent.tss)}`} data-node-id="210:1546" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.influent.tss.value}
        </p>
        <p className={`[word-break:break-word] absolute font-['SF_Pro:Medium'] font-[510] leading-[22px] left-[999px] text-[14px] top-[554px] whitespace-nowrap ${valueColor(d.effluent.tss)}`} data-node-id="210:1547" style={{ fontVariationSettings: '"wdth" 100' }}>
          {d.effluent.tss.value}
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+38.5px)] overflow-clip size-[20px] top-[calc(50%-141px)]" data-node-id="210:1558" data-name="Arrow Reply">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[12.5px] left-1/2 top-[calc(50%-0.25px)] w-[16px]" data-node-id="I210:1558;14992:2532" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape9} />
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[40px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1559" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1559;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1559;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Ideal: 6.5 – 8.5</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[40px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1561" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1561;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1561;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[172px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1708" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1708;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1708;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[734px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1753" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1753;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1753;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[304px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1699" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1699;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1699;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[866px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1754" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1754;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1754;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[436px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1715" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1715;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1715;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[998px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1755" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1755;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1755;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[40px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[873px]" data-node-id="210:1676" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1676;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1676;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[602px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[873px]" data-node-id="210:1756" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1756;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1756;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[172px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[873px]" data-node-id="210:1724" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1724;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1724;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[734px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[873px]" data-node-id="210:1757" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1757;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1757;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[172px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1562" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1562;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1562;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 30</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[305px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1563" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1563;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1563;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 50</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[437px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1564" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1564;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1564;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 50</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[602px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1565" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1565;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1565;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Ideal: 6.5 – 8.5</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[602px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[727px]" data-node-id="210:1567" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1567;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1567;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 10</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[734px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1568" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1568;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1568;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 30</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[867px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1569" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1569;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1569;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 50</p>
            </div>
          </div>
        </div>
        <div className="absolute bg-white content-stretch flex gap-[var(--spacingHorizontalNone,0px)] h-[20px] items-center justify-center left-[999px] min-w-[20px] opacity-80 overflow-clip px-[var(--spacingHorizontalXS,4px)] py-[var(--spacingVerticalNone,0px)] rounded-[var(--badge\/medium,9999px)] top-[581px]" data-node-id="210:1570" data-name="Badge">
          <div className="content-stretch flex flex-col h-[14px] items-center justify-end pb-[0.5px] px-[var(--spacingHorizontalXXS,2px)] relative shrink-0" data-node-id="I210:1570;9202:10398" data-name="Text offset">
            <div className="[word-break:break-word] flex flex-col font-['SF_Pro:Medium'] font-[510] justify-center leading-[0] relative shrink-0 text-[#0768d2] text-[12px] text-center whitespace-nowrap" data-node-id="I210:1570;9202:10399" style={{ fontVariationSettings: '"wdth" 100' }}>
              <p className="leading-[14px]">Limit: 0 – 50</p>
            </div>
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-[#e9f4ff] left-[calc(50%-511.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1571" data-name="Drop">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-1/2 top-1/2 w-[11px]" data-node-id="I210:1571;14992:15177" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape10} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+50.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1572" data-name="Drop">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-1/2 top-1/2 w-[11px]" data-node-id="I210:1572;14992:15177" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape10} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-246.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1573" data-name="Beaker">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14.002px] left-1/2 top-1/2 w-[12.001px]" data-node-id="I210:1573;14992:4022" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape11} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+315.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1574" data-name="Beaker">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14.002px] left-1/2 top-1/2 w-[12.001px]" data-node-id="I210:1574;14992:4022" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape12} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-379.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1575" data-name="Leaf">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14.01px] left-1/2 top-[calc(50%+0.01px)] w-[16px]" data-node-id="I210:1575;14992:21051" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape13} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+182.5px)] overflow-clip size-[20px] top-[calc(50%+15px)]" data-node-id="210:1576" data-name="Leaf">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[14.01px] left-1/2 top-[calc(50%+0.01px)] w-[16px]" data-node-id="I210:1576;14992:21051" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape14} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-114.5px)] size-[20px] top-[calc(50%+15px)]" data-node-id="210:1577" data-name="Circle Hint">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15.997px] top-1/2" data-node-id="I210:1577;14992:8826" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape15} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+447.5px)] size-[20px] top-[calc(50%+15px)]" data-node-id="210:1578" data-name="Circle Hint">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[15.997px] top-1/2" data-node-id="I210:1578;14992:8826" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape16} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+50.5px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="210:1581" data-name="Eyedropper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16.084px] left-[calc(50%-0.02px)] top-[calc(50%+0.03px)] w-[16.062px]" data-node-id="I210:1581;14992:16139" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape17} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-511.5px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="210:1582" data-name="Eyedropper">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16.084px] left-[calc(50%-0.02px)] top-[calc(50%+0.03px)] w-[16.062px]" data-node-id="I210:1582;14992:16139" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape18} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-246.5px)] overflow-clip size-[20px] top-[calc(50%+307px)]" data-node-id="210:1679" data-name="Group">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[14px] top-1/2" data-node-id="I210:1679;14992:18481" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape19} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+315.5px)] overflow-clip size-[20px] top-[calc(50%+307px)]" data-node-id="210:1758" data-name="Group">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[14px] top-1/2" data-node-id="I210:1758;14992:18481" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape20} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-115.5px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="225:2071" data-name="Water">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[13.503px] left-1/2 top-[calc(50%+0.25px)] w-[16px]" data-node-id="I225:2071;14992:40327" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape21} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+446.5px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="504:3512" data-name="Water">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[13.503px] left-1/2 top-[calc(50%+0.25px)] w-[16px]" data-node-id="I504:3512;14992:40327" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape22} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-379.5px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="225:2056" data-name="Temperature">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16.5px] left-1/2 top-[calc(50%+0.25px)] w-[9px]" data-node-id="I225:2056;14992:35659" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape23} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+182px)] overflow-clip size-[20px] top-[calc(50%+161px)]" data-node-id="504:3508" data-name="Temperature">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16.5px] left-1/2 top-[calc(50%+0.25px)] w-[9px]" data-node-id="I504:3508;14992:35659" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape24} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-247.5px)] size-[20px] top-[calc(50%+161px)]" data-node-id="225:2068" data-name="Gas Propane">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 top-[calc(50%-0.5px)] w-[12px]" data-node-id="I225:2068;14992:17889" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape25} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+315.5px)] size-[20px] top-[calc(50%+161px)]" data-node-id="504:3510" data-name="Gas Propane">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[15px] left-1/2 top-[calc(50%-0.5px)] w-[12px]" data-node-id="I504:3510;14992:17889" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape26} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-379.5px)] overflow-clip size-[20px] top-[calc(50%+307px)]" data-node-id="225:2101" data-name="Molecule">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-0.5px)] top-1/2 w-[15px]" data-node-id="I225:2101;14992:23391" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape27} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+182.5px)] overflow-clip size-[20px] top-[calc(50%+307px)]" data-node-id="504:3514" data-name="Molecule">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[16px] left-[calc(50%-0.5px)] top-1/2 w-[15px]" data-node-id="I504:3514;14992:23391" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape28} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-511.5px)] size-[20px] top-[calc(50%+307px)]" data-node-id="225:2117" data-name="Plant Ragweed">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[17px] left-1/2 top-[calc(50%+0.5px)] w-[9px]" data-node-id="I225:2117;14992:27838" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape29} />
          </div>
        </div>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+50.5px)] size-[20px] top-[calc(50%+307px)]" data-node-id="504:3515" data-name="Plant Ragweed">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[17px] left-1/2 top-[calc(50%+0.5px)] w-[9px]" data-node-id="I504:3515;14992:27838" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape30} />
          </div>
        </div>
          </>
        )}
        <div className="absolute inset-[2.46%_40.18%_93.85%_28.99%]" data-node-id="399:5014" data-name="Bounds">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgBounds2} />
        </div>
        <p className="[word-break:break-word] absolute font-['Inter:Medium'] font-medium h-[24px] leading-[24px] left-[341px] not-italic text-[#646464] text-[12px] top-[30px] w-[45px]" data-node-id="399:5015">
          Search
        </p>
        <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%+91.5px)] overflow-clip size-[16px] top-[calc(50%-446px)]" data-node-id="399:5016" data-name="Search">
          <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.5px)] size-[13px] top-[calc(50%-0.5px)]" data-node-id="I399:5016;14962:30771" data-name="Shape">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgShape31} />
          </div>
        </div>
      </div>
    </div>
  )
}
