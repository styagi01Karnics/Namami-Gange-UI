import AppLayout from '@/layouts/AppLayout'
import PageToolbar from '@/components/PageToolbar'
import ExportButtons from '@/components/ExportButtons'
import searchIcon from '@/assets/shared/icon-search.svg'

/**
 * G1 note: Full frame 418:5543 blocked by Figma View-seat rate limit.
 * Uses shared dashboard chrome pending design-context re-fetch.
 */
const items = [
  { name: 'pH Sensor Probe', sku: 'INV-1042', qty: '18', status: 'In Stock' },
  { name: 'DO Membrane Kit', sku: 'INV-2210', qty: '6', status: 'Low' },
  { name: 'Calibration Solution', sku: 'INV-3301', qty: '24', status: 'In Stock' },
  { name: 'Flow Meter Spares', sku: 'INV-4412', qty: '2', status: 'Critical' },
]

export default function Inventory() {
  return (
    <AppLayout breadcrumbs={[{ label: 'Inventory' }]}>
      <PageToolbar />
      <section className="overflow-hidden rounded-[10px] bg-[rgba(255,255,255,0.8)] shadow-[0px_0px_3px_1px_rgba(7,104,210,0.1)]">
        <div className="flex items-center justify-between gap-[12px] px-[16px] pt-[22px]">
          <button
            type="button"
            className="flex h-[36px] min-w-[280px] items-center justify-between rounded-[8px] border border-[#d8edff] bg-white px-[12px]"
          >
            <span className="text-[12px] font-[510] text-[#646464]">Search inventory</span>
            <img alt="" className="size-[13px]" src={searchIcon} />
          </button>
          <ExportButtons />
        </div>
        <div className="mt-[16px] overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-[#f5f5f5]">
                {['Item', 'SKU', 'Quantity', 'Status'].map((h) => (
                  <th key={h} className="px-[16px] py-[16px] text-left text-[14px] font-[510] text-[#7e7e7e]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.sku} className="border border-[#d8edff] bg-white">
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{item.name}</td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{item.sku}</td>
                  <td className="px-[16px] py-[24px] text-[14px] font-[510] text-[#07121e]">{item.qty}</td>
                  <td className="px-[16px] py-[24px]">
                    <span
                      className={
                        item.status === 'In Stock'
                          ? 'inline-flex h-[32px] items-center rounded-full bg-[#eaf3ec] px-[10px] text-[14px] font-[590] text-[#168e3f]'
                          : item.status === 'Low'
                            ? 'inline-flex h-[32px] items-center rounded-full bg-[#fff3e5] px-[10px] text-[14px] font-[590] text-[#ed7831]'
                            : 'inline-flex h-[32px] items-center rounded-full bg-[#fff4f4] px-[10px] text-[14px] font-[590] text-[#dc2626]'
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  )
}
