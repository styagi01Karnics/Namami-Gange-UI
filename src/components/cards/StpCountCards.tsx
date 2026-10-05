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
  brand: 'text-[#0375BC]',
  ok: 'text-[#168E3F] decoration-[#168E3F]',
  danger: 'text-[#DC2626] decoration-[#DC2626]',
}

function CountCard({ item }: { item: CountItem }) {
  const valueClass = [
    'text-[32px] font-bold leading-[40px]',
    VALUE[item.tone],
    item.href || item.onClick ? 'underline decoration-solid underline-offset-[4px]' : '',
  ].join(' ')

  return (
    <Card className="flex h-[112px] flex-col justify-center rounded-[8px] px-[16px] py-[18px] shadow-[0px_0px_3px_1.5px_rgba(0,0,0,0.25)]">
      <p className="text-[18px] font-semibold leading-6 text-[#07121E]">{item.label}</p>
      {item.onClick ? (
        <button type="button" onClick={item.onClick} className={`mt-[12px] w-fit ${valueClass}`}>
          {item.value}
        </button>
      ) : item.href ? (
        <Link to={item.href} className={`mt-[12px] w-fit ${valueClass}`}>
          {item.value}
        </Link>
      ) : (
        <p className={`mt-[12px] ${valueClass}`}>{item.value}</p>
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
      <div className="grid grid-cols-3 gap-[16px]">
        {items.map((item) => (
          <CountCard key={item.key} item={item} />
        ))}
      </div>

      <NonActiveStpModal open={nonActiveOpen} onClose={() => setNonActiveOpen(false)} />
    </>
  )
}
