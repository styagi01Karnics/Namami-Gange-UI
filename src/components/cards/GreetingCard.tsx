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
    <Card className="flex items-center justify-between gap-[20px] bg-gradient-to-r from-[#FFFFFF] to-[#DFF5FE] px-[22px] py-[18px]">
      <div className="min-w-0">
        <h2 className="text-[20px] font-bold leading-7 text-brand">
          {greetingForHour(now.getHours())}, {firstName}
        </h2>
        <p className="mt-[5px] text-[13.5px] font-medium leading-5 text-ink-soft">
          {dashboardGreeting.subtitle}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-[12px] rounded-[12px] border border-white/80 bg-white px-[14px] py-[10px] shadow-[0px_0px_3px_1px_#0768D21A]">
        <span className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-brand-soft">
          <ClockIcon size={22} className="text-brand" />
        </span>
        <div className="leading-tight">
          <p className="text-[13.5px] font-semibold text-ink">{day}</p>
          <p className="mt-[2px] text-[12.5px] font-medium text-ink-muted">{time}</p>
        </div>
      </div>
    </Card>
  )
}
