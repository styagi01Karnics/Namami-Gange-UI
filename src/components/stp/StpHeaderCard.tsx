import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Icon } from '@iconify/react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'

const CalendarIcon = ico('fluent:calendar-32-filled')
const PinIcon = ico('fluent:location-24-filled')
const PersonIcon = ico('fluent:person-24-filled')
const PhoneIcon = ico('fluent:call-24-filled')
const MailIcon = ico('fluent:mail-24-filled')
const RoleIcon = ico('fluent:hat-graduation-24-filled')

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

function DetailsPanel({ stp }) {
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
            <SiteField label="Vendor" value={vendor.name} />
            <SiteField label="Prefix ID" value={vendor.prefixId} />
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

export default function StpHeaderCard({ stp, showPenalty = true }) {
  const [showDetails, setShowDetails] = useState(false)

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
            <Stamp label="Created on" value={stp.createdOn} />
            <Stamp label="Last seen" value={stp.lastSeen} />
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
          <div className="w-[248px] shrink-0 rounded-[10px] bg-[#FFF8F8] p-[16px] shadow-[0px_0px_3px_1px_#DC26261A]">
            <div className="flex items-center gap-[12px]">
              <span className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[8px] bg-[#FDE6E6]">
                <Icon icon="clarity:warning-standard-solid" width={26} height={26} className="text-danger" />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-4 text-ink">Total Penalty</p>
                <p className="mt-[10px] text-[16px] font-bold leading-5 text-[#DC2626]">{stp.penalty.amount}</p>
              </div>
            </div>
            <div className="mt-[10px] flex justify-end">
              <span className="rounded-full bg-[#EEF6FD] px-[8px] py-[4px] text-[11.5px] font-medium leading-4 text-[#0768D2]">
                Across all location
              </span>
            </div>
          </div>
        )}
      </div>

      {showDetails && <DetailsPanel stp={stp} />}
    </Card>
  )
}
