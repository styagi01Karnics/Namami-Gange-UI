import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import NonActiveStpModal from './NonActiveStpModal'

type CountItem = {
  key: string
  label: string
  value: number
  tone: 'brand' | 'ok' | 'danger'
  href?: string
  onClick?: () => void
}

const VALUE = {
  brand: 'text-brand',
  ok: 'text-ok decoration-ok',
  danger: 'text-danger decoration-danger',
}

function CountCard({ item }: { item: CountItem }) {
  const valueClass = [
    'text-[28px] font-bold leading-8',
    VALUE[item.tone],
    item.href || item.onClick ? 'underline decoration-2 underline-offset-[6px]' : '',
  ].join(' ')

  return (
    <Card className="flex min-h-[96px] flex-col justify-center px-[18px] py-[16px]">
      <p className="text-[13px] font-medium leading-4 text-ink-soft">{item.label}</p>
      {item.onClick ? (
        <button type="button" onClick={item.onClick} className={`mt-[10px] w-fit ${valueClass}`}>
          {item.value}
        </button>
      ) : item.href ? (
        <Link to={item.href} className={`mt-[10px] w-fit ${valueClass}`}>
          {item.value}
        </Link>
      ) : (
        <p className={`mt-[10px] ${valueClass}`}>{item.value}</p>
      )}
    </Card>
  )
}

export default function StpCountCards({
  total,
  active,
  nonActive,
}: {
  total: number
  active: number
  nonActive: number
}) {
  const [nonActiveOpen, setNonActiveOpen] = useState(false)

  const items: CountItem[] = [
    { key: 'total', label: "Total STP's", value: total, tone: 'brand' },
    { key: 'active', label: "Active STP's", value: active, tone: 'ok', href: '/stp-management' },
    {
      key: 'nonActive',
      label: "Non-Active STP's",
      value: nonActive,
      tone: 'danger',
      onClick: () => setNonActiveOpen(true),
    },
  ]

  return (
    <>
      <div className="grid grid-cols-3 gap-[12px]">
        {items.map((item) => (
          <CountCard key={item.key} item={item} />
        ))}
      </div>

      <NonActiveStpModal open={nonActiveOpen} onClose={() => setNonActiveOpen(false)} />
    </>
  )
}
