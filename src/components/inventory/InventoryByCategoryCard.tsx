import IconToggle from '../ui/IconToggle'
import CategoryDonut from './CategoryDonut'
import { inventoryByCategory } from '../../data/mockData'

export default function InventoryByCategoryCard({
  open,
  onToggle,
  title = 'Inventory by Category',
}) {
  return (
    <section className="flex min-w-0 flex-col rounded-[10px] border border-[#C7DDFB] bg-white/80 p-[16px]">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold leading-[22px] text-[#07121E]">{title}</h3>
        <IconToggle open={open} onClick={onToggle} label={`Toggle ${title}`} />
      </div>

      {open && (
        <>
          <div className="mt-[16px]">
            <CategoryDonut data={inventoryByCategory} />
          </div>

          <ul className="mt-[18px] space-y-[14px]">
            {inventoryByCategory.map((c) => (
              <li key={c.key} className="flex items-center">
                <span className="mr-[5px] h-[10px] w-[10px] shrink-0 rounded-full" style={{ background: c.color }} />
                <span className="text-[14px] font-semibold leading-normal text-[#565656]">{c.label}</span>
                <span className="ml-auto w-[54px] text-right text-[14px] font-bold leading-normal text-[#07121E]">
                  {c.value}
                </span>
                <span className="ml-[10px] inline-flex h-[20px] min-w-[40px] items-center justify-center rounded-full bg-[#F1F7FF] px-[4px] text-[12px] font-semibold leading-[14px] text-[#0768D2] opacity-80">
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
