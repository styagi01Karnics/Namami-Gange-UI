import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { fetchPenaltyVendors } from '../../api/penalty'

const PinIcon = ico('fluent:location-24-filled')

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid grid-cols-[120px_12px_1fr] items-baseline gap-x-[4px] text-[13px] leading-[20px]">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink-soft">:</span>
      <span className="min-w-0 break-words font-medium text-ink">{value || '—'}</span>
    </div>
  )
}

function DetailColumn({ title, rows, bordered }: { title: string; rows: [string, string | null | undefined][]; bordered?: boolean }) {
  return (
    <div className={`min-w-0 ${bordered ? 'lg:border-l lg:border-[#E3ECF7] lg:pl-[28px]' : ''}`}>
      <h3 className="text-[15px] font-semibold leading-5 text-[#003C7A]">{title}</h3>
      <div className="mt-[10px] space-y-[4px]">
        {rows.map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
      </div>
    </div>
  )
}

type StpInfo = {
  name: string
  address: string
  inCharge: { name: string; phone: string; email: string; role: string; department?: string; alternateContact?: string }
  vendor: {
    name: string
    prefixId: string
    contactPerson?: string
    phone?: string
    email?: string
    amcStart?: string
    amcEnd?: string
    serviceType?: string
    address?: string
  }
  site: { state: string; city: string; zip: string; lat: string; lng: string; technology?: string; commissionedOn?: string }
}

function DetailsPanel({
  stp,
  vendorName,
  prefixId,
}: {
  stp: StpInfo
  vendorName?: string | null
  prefixId?: string | null
}) {
  const { inCharge, vendor, site } = stp
  const capacity = stp.name.match(/[\d.]+\s*MLD/i)?.[0]
  const plantName = stp.name.replace(/\s+STP,?\s*/i, ' ').trim()

  return (
    <div className="mt-[16px] grid grid-cols-1 gap-x-[28px] gap-y-[20px] rounded-[10px] border border-[#E3ECF7] bg-white px-[18px] py-[16px] lg:grid-cols-3">
      <DetailColumn
        title="STP Details"
        rows={[
          ['STP Name', plantName],
          ['State', site.state],
          ['City', site.city],
          ['Address', stp.address],
          ['Zip Code', site.zip],
          ['Latitude', site.lat],
          ['Longitude', site.lng],
          ['Capacity', capacity],
          ['Technology', site.technology],
          ['Commissioned On', site.commissionedOn],
        ]}
      />
      <DetailColumn
        bordered
        title="STP In-Charge"
        rows={[
          ['Name', inCharge.name],
          ['Designation', inCharge.role],
          ['Department', inCharge.department],
          ['Mobile', inCharge.phone],
          ['Email', inCharge.email],
          ['Alternate Contact', inCharge.alternateContact],
        ]}
      />
      <DetailColumn
        bordered
        title="Vendor Details"
        rows={[
          ['Vendor Name', vendorName || vendor.name],
          ['Contact Person', vendor.contactPerson],
          ['Mobile', vendor.phone],
          ['Email', vendor.email],
          ['Prefix ID', prefixId || vendor.prefixId],
          ['AMC Start Date', vendor.amcStart],
          ['AMC End Date', vendor.amcEnd],
          ['Service Type', vendor.serviceType],
          ['Address', vendor.address],
        ]}
      />
    </div>
  )
}

export default function StpHeaderCard({
  stp,
  plantCode,
}: {
  stp: StpInfo & {
    status: string
    penalty: { amount: string; reason?: string }
  }
  plantCode?: string
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [vendorName, setVendorName] = useState<string | null>(null)

  useEffect(() => {
    if (!plantCode) {
      setVendorName(null)
      return undefined
    }

    let cancelled = false
    const code = plantCode
    setVendorName(null)

    async function loadVendor() {
      const vendors = await fetchPenaltyVendors(code)
      if (cancelled) return
      setVendorName(vendors[0]?.vendor_name ?? null)
    }

    loadVendor()
    return () => {
      cancelled = true
    }
  }, [plantCode])

  return (
    <Card className="rounded-[12px] border-0 bg-white p-[16px] shadow-card">
      <div className="min-w-0">
        <div className="flex items-center gap-[10px]">
          <h2 className="text-[18px] font-bold leading-8 text-[#003C7A]">{stp.name}</h2>
          <StatusPill
            tone={statusTone(stp.status)}
            className="h-[32px] bg-[#EAF3EC] px-[8px] text-[14px] leading-4 text-[#168E3F]"
          >
            {stp.status}
          </StatusPill>
        </div>

        <p
          className="mt-[8px] flex items-center gap-[6px] text-[14px] font-semibold leading-[22px] text-[#F69A30] underline decoration-solid underline-offset-[3px]"
          title={stp.address}
        >
          <PinIcon size={16} className="shrink-0" />
          View Location
        </p>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          className="mt-[12px] flex items-center gap-[4px] text-[14px] font-semibold leading-[22px] text-[#0768D2] underline decoration-solid underline-offset-[3px]"
        >
          Details
          <ChevronDown size={16} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showDetails && (
        <DetailsPanel stp={stp} vendorName={vendorName} prefixId={plantCode ?? stp.vendor.prefixId} />
      )}
    </Card>
  )
}
