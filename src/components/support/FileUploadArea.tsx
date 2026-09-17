import { useRef, useState } from 'react'
import { ico } from '../ui/Ico'

const ACCEPT = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif']
const MAX_BYTES = 10 * 1024 * 1024

const UploadIcon = ico('fluent:cloud-arrow-up-24-filled')
const TrashIcon = ico('fluent:delete-24-filled')

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function makeEntry(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    file,
    name: file.name,
    size: formatSize(file.size),
    progress: 0,
    error: null,
  }
}

/** Drag-and-drop zone + upload list used by the Raise Ticket modal. */
export default function FileUploadArea({ files, onChange, compact = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const simulateUpload = (id) => {
    let progress = 0
    const tick = () => {
      progress += Math.random() * 22 + 8
      if (progress >= 100) {
        onChange((prev) => prev.map((f) => (f.id === id ? { ...f, progress: 100 } : f)))
        return
      }
      onChange((prev) => prev.map((f) => (f.id === id ? { ...f, progress: Math.round(progress) } : f)))
      window.setTimeout(tick, 180)
    }
    window.setTimeout(tick, 120)
  }

  const addFiles = (list) => {
    const next = [...files]
    const added = []

    for (const file of list) {
      const id = `${file.name}-${file.size}-${file.lastModified}`
      if (next.some((f) => f.id === id)) continue

      let entry = makeEntry(file)
      if (!ACCEPT.includes(file.type)) {
        entry = { ...entry, error: 'Only PDF, PNG, JPG or GIF files are allowed.' }
      } else if (file.size > MAX_BYTES) {
        entry = { ...entry, error: 'File exceeds the 10 MB limit.' }
      }

      next.push(entry)
      if (!entry.error) added.push(entry)
    }

    onChange(next)
    added.forEach((f) => simulateUpload(f.id))
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles([...e.dataTransfer.files])
  }

  const remove = (id) => onChange((prev) => prev.filter((f) => f.id !== id))

  return (
    <div>
      <p className="mb-[6px] text-[12.5px] font-medium leading-4 text-ink-soft">Attachments</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragging(false)
        }}
        onDrop={onDrop}
        className={`flex w-full flex-col items-center justify-center rounded-[10px] border border-dashed transition-colors ${
          compact ? 'px-[14px] py-[12px]' : 'px-[16px] py-[22px]'
        } ${dragging ? 'border-brand bg-brand-soft/40' : 'border-[#C5D9F2] bg-[#F8FBFF] hover:bg-[#F2F8FE]'}`}
      >
        <span
          className={`flex items-center justify-center rounded-full bg-ok-soft text-ok ${
            compact ? 'h-[30px] w-[30px]' : 'h-[36px] w-[36px]'
          }`}
        >
          <UploadIcon size={compact ? 16 : 18} />
        </span>
        <p className={`text-ink-soft ${compact ? 'mt-[6px] text-[12.5px] leading-4' : 'mt-[10px] text-[13px] leading-5'}`}>
          Click to upload or <span className="font-semibold text-brand">drag and drop</span>
        </p>
        <p className={`text-ink-muted ${compact ? 'mt-[2px] text-[11px] leading-4' : 'mt-[4px] text-[11.5px] leading-4'}`}>
          PDF, PNG, JPG or GIF (max. 10MB)
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.gif"
        className="hidden"
        onChange={(e) => {
          addFiles([...e.target.files])
          e.target.value = ''
        }}
      />

      {files.length > 0 && (
        <ul className="mt-[12px] space-y-[10px]">
          {files.map((f) => (
            <li key={f.id} className="rounded-[10px] border border-line bg-white px-[12px] py-[10px]">
              <div className="flex items-start justify-between gap-[10px]">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium leading-[18px] text-ink">{f.name}</p>
                  <p className="text-[11.5px] leading-4 text-ink-muted">{f.size}</p>
                  {f.error && <p className="mt-[4px] text-[11.5px] leading-4 text-danger">{f.error}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  aria-label={`Remove ${f.name}`}
                  className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[7px] text-danger transition-colors hover:bg-danger-soft"
                >
                  <TrashIcon size={15} />
                </button>
              </div>

              {!f.error && (
                <div className="mt-[8px] h-[6px] overflow-hidden rounded-full bg-[#E7EEF7]">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-200"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
