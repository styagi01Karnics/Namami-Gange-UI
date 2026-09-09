import { useState } from 'react'
import IconToggle from '../ui/IconToggle'
import CategoryDonut from './CategoryDonut'
import { getStpPageMetrics, inventoryByCategory } from '../../data/mockData'

export default function InventoryByCategoryCard({ stpId }) {
  const [open, setOpen] = useState(true)
  const categories = getStpPageMetrics(stpId)?.inventoryCategory ?? inventoryByCategory

  return (
    <section className="flex min-w-0 flex-col rounded-[12px] border border-line bg-white p-[15px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold leading-5 text-ink">Inventory by Category</h3>
        <IconToggle open={open} onClick={() => setOpen((v) => !v)} label="Toggle Inventory by Category" />
      </div>

      {open && (
        <>
          <div className="mt-[16px]">
            <CategoryDonut data={categories} />
          </div>

          <ul className="mt-[18px] space-y-[13px]">
            {categories.map((c) => (
              <li key={c.key} className="flex items-center">
                <span className="mr-[9px] h-[9px] w-[9px] shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="text-[12.5px] font-medium leading-4 text-ink-soft">{c.label}</span>
                <span className="ml-auto w-[54px] text-right text-[13px] font-semibold leading-4 text-ink">
                  {c.value}
                </span>
                <span className="ml-[10px] w-[46px] text-right text-[12.5px] font-medium leading-4 text-ink-soft">
                  {c.percent}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
