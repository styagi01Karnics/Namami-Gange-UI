import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Maximize2, X } from 'lucide-react'
import { ico } from '../ui/Ico'
import Card from '../ui/Card'
import StatusPill, { statusTone } from '../ui/StatusPill'
import { fetchPenaltyVendors } from '../../api/penalty'
import { stpDetails } from '../../data/mockData'

const PinIcon = ico('fluent:location-24-filled')

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_12px_1fr] items-baseline gap-x-[4px] text-[13px] leading-[20px]">
      <span className="text-ink-soft">{label}</span>
      <span className="text-ink-soft">:</span>
      <span className="min-w-0 break-words font-medium text-ink">{value}</span>
    </div>
  )
}

function DetailColumn({ title, rows, bordered }: { title: string; rows: [string, string | null | undefined][]; bordered?: boolean }) {
  return (
    <div className={`min-w-0 ${bordered ? 'lg:border-l lg:border-[#E3ECF7] lg:pl-[28px]' : ''}`}>
      <h3 className="text-[15px] font-semibold leading-5 text-[#003C7A]">{title}</h3>
      <div className="mt-[10px] space-y-[4px]">
        {rows
          .filter((row): row is [string, string] => Boolean(row[1]?.trim()))
          .map(([label, value]) => <DetailRow key={label} label={label} value={value} />)}
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
  images?: string[]
}

function resolveImages(stp: StpInfo, plantCode?: string): string[] {
  if (stp.images && stp.images.length > 0) return stp.images

  for (const [key, detail] of Object.entries(stpDetails)) {
    if (
      key === plantCode ||
      (detail.vendor?.prefixId && detail.vendor.prefixId === plantCode) ||
      (detail.name && stp.name && detail.name.toLowerCase() === stp.name.toLowerCase())
    ) {
      if (detail.images && detail.images.length > 0) return detail.images
    }
  }

  const clean = (stp.name || plantCode || '').toLowerCase()
  if (clean.includes('18') && (clean.includes('jag') || clean.includes('jagjeetpur'))) return ['/stp-images/jagjeetpur-18.jpg']
  if (clean.includes('68') && (clean.includes('jag') || clean.includes('jagjeetpur'))) return ['/stp-images/jagjeetpur-68.jpg', '/stp-images/jagjeetpur-68-2.jpg']
  if (clean.includes('jagjeetpur')) return ['/stp-images/jagjeetpur-68.jpg', '/stp-images/jagjeetpur-68-2.jpg']
  if (clean.includes('18') && clean.includes('sarai')) return ['/stp-images/sarai-18.jpg']
  if (clean.includes('14') && clean.includes('sarai')) return ['/stp-images/sarai-14.jpg', '/stp-images/sarai-14-2.jpg']
  if (clean.includes('sarai')) return ['/stp-images/sarai-14.jpg', '/stp-images/sarai-14-2.jpg']
  if (clean.includes('kargi')) return ['/stp-images/kargi-68.jpg', '/stp-images/kargi-68-2.jpg']
  if (clean.includes('lakkar')) return ['/stp-images/lakkar-ghat-26.jpg', '/stp-images/lakkar-ghat-26-2.jpg']
  if (clean.includes('moth_2') || clean.includes('mothorowala 2')) return ['/stp-images/mothorowala-20-2.jpg']
  if (clean.includes('mothorowala') || clean.includes('moth')) return ['/stp-images/mothorowala-20.jpg']
  if (clean.includes('sali')) return ['/stp-images/saliar-33.jpg']
  if (clean.includes('bazpur')) return ['/stp-images/bazpur-10.jpg']
  return []
}

function DetailsPanel({
  stp,
  vendorName,
}: {
  stp: StpInfo
  vendorName?: string | null
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
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  const [vendorName, setVendorName] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const handleViewLocation = () => {
    const stpKey = plantCode || stp.vendor?.prefixId || stp.name
    navigate(`/dashboard?stp=${encodeURIComponent(stpKey)}`)
  }

  const rawImages = resolveImages(stp, plantCode)
  const images = rawImages.filter((src) => !failedImages[src])

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
      <div className="flex flex-col gap-[16px] md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 shrink-0">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[18px] font-bold leading-8 text-[#003C7A]">{stp.name}</h2>
            <StatusPill
              tone={statusTone(stp.status)}
              className="h-[32px] bg-[#EAF3EC] px-[8px] text-[14px] leading-4 text-[#168E3F]"
            >
              {stp.status}
            </StatusPill>
          </div>

          <button
            type="button"
            onClick={handleViewLocation}
            className="mt-[8px] flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold leading-[22px] text-[#F69A30] underline decoration-solid underline-offset-[3px] transition-colors hover:text-[#D97706]"
            title={`View ${stp.name} on map`}
          >
            <PinIcon size={16} className="shrink-0" />
            View Location
          </button>

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

        {/* STP Photo Gallery in highlighted top header space */}
        {images.length > 0 && (
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-[12px]">
            {images.map((imgSrc, idx) => (
              <button
                key={imgSrc}
                type="button"
                onClick={() => setPreviewImage(imgSrc)}
                className="group relative h-[88px] w-[148px] shrink-0 overflow-hidden rounded-[8px] border border-[#CBD5E1] bg-[#F8FAFC] shadow-sm transition hover:scale-[1.02] hover:border-[#0768D2] hover:shadow-md cursor-pointer"
                title={`Click to view full photo of ${stp.name}`}
              >
                <img
                  src={imgSrc}
                  alt={`${stp.name} photo ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  onError={() => {
                    setFailedImages((prev) => ({ ...prev, [imgSrc]: true }))
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <span className="rounded-full bg-white/90 p-1.5 shadow">
                    <Maximize2 size={14} className="text-[#003C7A]" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {showDetails && (
        <DetailsPanel stp={stp} vendorName={vendorName} />
      )}

      {/* Lightbox Preview Modal */}
      {previewImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[12px] bg-white p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
              title="Close image preview"
            >
              <X size={18} />
            </button>
            <img
              src={previewImage}
              alt={stp.name}
              className="max-h-[80vh] w-auto max-w-full rounded-[8px] object-contain"
            />
            <p className="mt-2 text-center text-[14px] font-semibold text-[#003C7A]">
              {stp.name}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
