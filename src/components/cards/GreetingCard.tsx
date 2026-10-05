import { useEffect, useState } from 'react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import { currentUser, dashboardGreeting } from '../../data/mockData'

const ClockIcon = ico('basil:history-outline')

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function formatParts(date: Date) {
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  return { day, time }
}

export default function GreetingCard() {
  const [now, setNow] = useState(() => new Date())
  const firstName = currentUser.name.split(' ')[0] ?? currentUser.name

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const { day, time } = formatParts(now)

  return (
    <Card className="flex h-[118px] items-center justify-between gap-[20px] rounded-[12px] bg-gradient-to-r from-[#FFFFFF] to-[#DFF5FE] px-[16px] py-[15px]">
      <div className="min-w-0">
        <h2 className="text-[24px] font-semibold leading-[40px] text-[#07121E]">
          {greetingForHour(now.getHours())}, {firstName}
        </h2>
        <p className="mt-[8px] text-[16px] font-medium leading-5 text-[#646464]">
          {dashboardGreeting.subtitle}
        </p>
      </div>

      <div className="flex h-[88px] w-[270px] shrink-0 items-center gap-[16px] rounded-[8px] bg-white/80 px-[16px]">
        <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-[#DFF5FE]">
          <ClockIcon size={32} className="text-[#0768D2]" />
        </span>
        <div className="leading-tight">
          <p className="text-[20px] font-semibold leading-[22px] text-[#07121E]">{day}</p>
          <p className="mt-[8px] text-[16px] font-semibold leading-[22px] text-[#0768D2]">{time}</p>
        </div>
      </div>
    </Card>
  )
}
