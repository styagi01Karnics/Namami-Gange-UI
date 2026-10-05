import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { fetchPenaltyVendors } from '../../api/penalty'

const PinIcon = ico('fluent:location-24-filled')
const PersonIcon = ico('fluent:person-24-filled')
const PhoneIcon = ico('fluent:call-24-filled')
const MailIcon = ico('fluent:mail-24-filled')
const RoleIcon = ico('fluent:hat-graduation-24-filled')

function ContactItem({ icon: Glyph, children }) {
  return (
    <div className="flex min-w-0 items-center gap-[8px] text-[13px] leading-[18px] text-ink">
      <Glyph size={15} className="shrink-0 text-brand" />
      <span className="truncate">{children}</span>
    </div>
  )
}

function SiteField({ label, value }) {
  return (
    <div className="flex min-w-0 items-baseline gap-[10px]">
      <span className="shrink-0 text-[12.5px] font-medium leading-4 text-ink-soft">{label}</span>
      <span className="truncate text-[13px] font-semibold leading-[18px] text-ink">{value}</span>
    </div>
  )
}

function DetailsPanel({
  stp,
  vendorName,
  prefixId,
}: {
  stp: {
    inCharge: { name: string; phone: string; email: string; role: string }
    vendor: { name: string; prefixId: string }
    site: { state: string; city: string; zip: string; lat: string; lng: string }
  }
  vendorName?: string | null
  prefixId?: string | null
}) {
  const { inCharge, vendor, site } = stp

  return (
    <div className="mt-[16px]">
      <div className="grid grid-cols-[1.35fr_1fr] items-start gap-x-[40px] gap-y-[16px]">
        <div>
          <h3 className="text-[14px] font-semibold leading-5 text-[#0768D2]">STP In-Charges</h3>
          <div className="mt-[12px] grid grid-cols-2 gap-x-[28px] gap-y-[12px]">
            <ContactItem icon={PersonIcon}>{inCharge.name}</ContactItem>
            <ContactItem icon={PhoneIcon}>{inCharge.phone}</ContactItem>
            <ContactItem icon={MailIcon}>{inCharge.email}</ContactItem>
            <ContactItem icon={RoleIcon}>{inCharge.role}</ContactItem>
          </div>
        </div>

        <div>
          <h3 className="text-[14px] font-semibold leading-5 text-[#0768D2]">Vendor Details</h3>
          <div className="mt-[12px] space-y-[12px]">
            <SiteField label="Vendor" value={vendorName || vendor.name || '—'} />
            <SiteField label="Prefix ID" value={prefixId || vendor.prefixId || '—'} />
          </div>
        </div>
      </div>

      <h3 className="mt-[18px] text-[14px] font-semibold leading-5 text-[#0768D2]">STP Details</h3>
      <div className="mt-[10px] rounded-[10px] border border-[#C7DDFB] bg-white px-[18px] py-[14px]">
        <div className="grid grid-cols-3 gap-x-[24px] gap-y-[12px]">
          <SiteField label="State" value={site.state} />
          <SiteField label="City" value={site.city} />
          <SiteField label="Zip Code" value={site.zip} />
          <SiteField label="Latitude" value={site.lat} />
          <SiteField label="Longitude" value={site.lng} />
        </div>
      </div>
    </div>
  )
}

export default function StpHeaderCard({
  stp,
  plantCode,
}: {
  stp: {
    name: string
    status: string
    address: string
    penalty: { amount: string; reason?: string }
    inCharge: { name: string; phone: string; email: string; role: string }
    vendor: { name: string; prefixId: string }
    site: { state: string; city: string; zip: string; lat: string; lng: string }
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
