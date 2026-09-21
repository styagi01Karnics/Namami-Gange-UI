import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Icon } from '@iconify/react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { useAuth } from '../../auth/AuthContext'
import { fetchPenaltySummary, fetchPenaltyVendors, formatPenaltyAmount } from '../../api/penalty'

const CalendarIcon = ico('fluent:calendar-32-filled')
const PinIcon = ico('fluent:location-24-filled')
const PersonIcon = ico('fluent:person-24-filled')
const PhoneIcon = ico('fluent:call-24-filled')
const MailIcon = ico('fluent:mail-24-filled')
const RoleIcon = ico('fluent:hat-graduation-24-filled')

const STP_CREATED_ON = '08/15/2026, 9.00 PM'

function Stamp({ label, value }) {
  return (
    <span className="flex items-center gap-[6px]">
      <CalendarIcon size={14} className="text-[#8B99AA]" />
      <span className="text-[12.5px] leading-4 text-ink-muted">{label} :</span>
      <span className="text-[12.5px] font-semibold leading-4 text-ink">{value}</span>
    </span>
  )
}

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
          <h3 className="text-[13.5px] font-semibold leading-5 text-brand">STP In-Charges</h3>
          <div className="mt-[12px] grid grid-cols-2 gap-x-[28px] gap-y-[12px]">
            <ContactItem icon={PersonIcon}>{inCharge.name}</ContactItem>
            <ContactItem icon={PhoneIcon}>{inCharge.phone}</ContactItem>
            <ContactItem icon={MailIcon}>{inCharge.email}</ContactItem>
            <ContactItem icon={RoleIcon}>{inCharge.role}</ContactItem>
          </div>
        </div>

        <div>
          <h3 className="text-[13.5px] font-semibold leading-5 text-brand">Vendor Details</h3>
          <div className="mt-[12px] space-y-[12px]">
            <SiteField label="Vendor" value={vendorName || vendor.name || '—'} />
            <SiteField label="Prefix ID" value={prefixId || vendor.prefixId || '—'} />
          </div>
        </div>
      </div>

      <h3 className="mt-[18px] text-[13.5px] font-semibold leading-5 text-brand">STP Details</h3>
      <div className="mt-[10px] rounded-[10px] border border-line bg-white px-[18px] py-[14px]">
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
  showPenalty = true,
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
  showPenalty?: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [penaltyAmount, setPenaltyAmount] = useState<string | null>(null)
  const [penaltyLoading, setPenaltyLoading] = useState(false)
  const [vendorName, setVendorName] = useState<string | null>(null)
  const { lastLoginAt } = useAuth()

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

  useEffect(() => {
    if (!showPenalty || !plantCode) {
      setPenaltyAmount(null)
      setPenaltyLoading(false)
      return undefined
    }

    let cancelled = false
    const code = plantCode
    setPenaltyLoading(true)
    setPenaltyAmount(null)

    async function loadPenalty() {
      const summary = await fetchPenaltySummary(code)
      if (cancelled) return
      // Always prefer API value (including ₹0) over mock STP amounts.
      setPenaltyAmount(summary ? formatPenaltyAmount(summary.totalAssessedAmount) : '—')
      setPenaltyLoading(false)
    }

    loadPenalty()
    return () => {
      cancelled = true
    }
  }, [plantCode, showPenalty])

  const displayPenalty = plantCode
    ? penaltyLoading
      ? '…'
      : (penaltyAmount ?? '—')
    : stp.penalty.amount

  return (
    <Card className="bg-gradient-to-r from-[#FFFFFF] to-[#DFF5FE] p-[15px]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[17px] font-bold leading-6 text-brand">{stp.name}</h2>
            <StatusPill tone={statusTone(stp.status)}>{stp.status}</StatusPill>
          </div>

          <p className="mt-[9px] flex items-center gap-[6px] text-[13px] font-medium leading-4 text-orange">
            <PinIcon size={15} className="shrink-0" />
            {stp.address}
          </p>

          <div className="mt-[9px] flex flex-wrap items-center gap-x-[22px] gap-y-[6px]">
            <Stamp label="Created on" value={STP_CREATED_ON} />
            <Stamp label="Last seen" value={lastLoginAt ?? '—'} />
          </div>

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            className="mt-[13px] flex items-center gap-[4px] text-[13px] font-medium leading-4 text-brand-link underline decoration-brand-link/60 underline-offset-[3px]"
          >
            Details
            <ChevronDown size={15} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showPenalty && (
          <div className="w-[196px] shrink-0 rounded-[10px] bg-[#FFF8F8] p-[16px] shadow-[0px_0px_3px_1px_#DC26261A]">
            <div className="flex items-center gap-[10px]">
              <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[4px] bg-[#FDE6E6]">
                <Icon icon="clarity:warning-standard-solid" width={18} height={18} className="text-danger" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-4 text-ink">Total Penalty</p>
                <p className="mt-[4px] text-[16px] font-bold leading-5 text-[#DC2626]">{displayPenalty}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <DetailsPanel stp={stp} vendorName={vendorName} prefixId={plantCode ?? stp.vendor.prefixId} />
      )}
    </Card>
  )
}
