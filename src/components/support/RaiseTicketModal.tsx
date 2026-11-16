import { useEffect, useState } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import Select from '../ui/Select'
import FileUploadArea from './FileUploadArea'
import { supportTicketPriorities } from '../../api/supportTickets'

const PersonIcon = ico('fluent:person-24-filled')
const ListIcon = ico('fluent:text-bullet-list-24-filled')

const EMPTY = { category: '', issue: '', description: '', priority: 'Mid' }

function FieldLabel({ children, required = false }) {
  return (
    <span className="mb-[10px] block text-[12.5px] font-semibold leading-4 text-ink-soft">
      {children}
      {required && <span className="text-danger"> *</span>}
    </span>
  )
}

function FormSection({ icon: Icon, title, children }) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-line">
      <header className="flex items-center gap-[9px] bg-[#EEF5FE] px-[16px] py-[12px]">
        <Icon size={16} className="text-brand" />
        <h3 className="text-[13px] font-bold leading-[18px] text-brand">{title}</h3>
      </header>
      <div className="space-y-[18px] px-[16px] pb-[18px] pt-[18px]">{children}</div>
    </section>
  )
}

export default function RaiseTicketModal({ open, onClose, onSubmit, categories = [] }) {
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setForm(EMPTY)
      setFiles([])
      setError('')
    }
  }, [open])

  if (!open) return null

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const setCategory = (value) => setForm((prev) => ({ ...prev, category: value, issue: '' }))
  const selectedCategory = categories.find((c) => c.name === form.category)
  const categoryNames = categories.map((c) => c.name)
  const subOptions = selectedCategory?.subCategories.map((s) => s.name) ?? []
  const canSubmit = form.category && form.issue.trim() && form.description.trim() && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    const subCategory = selectedCategory?.subCategories.find((s) => s.name === form.issue)
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        categoryId: String(selectedCategory?.id ?? ''),
        subCategoryId: subCategory ? String(subCategory.id) : undefined,
        subject: form.issue.trim(),
        description: form.description.trim(),
        priority: form.priority,
        files: files.filter((f) => !f.error).map((f) => f.file),
      })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="raise-ticket-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[calc(100vh-40px)] w-full max-w-[560px] flex-col rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex shrink-0 items-center gap-[10px] px-[22px] pb-[16px] pt-[22px]">
          <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-brand-soft text-brand">
            <PersonIcon size={18} />
          </span>
          <h2 id="raise-ticket-title" className="text-[17px] font-extrabold leading-6 text-ink">
            Raise a Ticket
          </h2>
        </div>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-[22px]">
          <FormSection icon={ListIcon} title="Issue Details">
            <div>
              <FieldLabel required>Category</FieldLabel>
              <Select
                options={categoryNames}
                value={form.category}
                onChange={setCategory}
                placeholder="Select Category"
              />
            </div>

            <div>
              <FieldLabel required>Sub Category</FieldLabel>
              <Select
                options={subOptions}
                value={form.issue}
                onChange={set('issue')}
                placeholder={form.category ? 'Add Issue' : 'Select a category first'}
                disabled={!form.category}
              />
            </div>

            <label className="block">
              <FieldLabel required>Description</FieldLabel>
              <textarea
                value={form.description}
                onChange={(e) => set('description')(e.target.value)}
                placeholder="Add Details"
                rows={4}
                className="w-full resize-none rounded-[9px] border border-line bg-white px-[13px] py-[10px] text-[13px] leading-5 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
              />
            </label>

            <fieldset>
              <legend className="mb-[10px] text-[12.5px] font-semibold leading-4 text-ink-soft">Priority</legend>
              <div className="grid grid-cols-3 gap-[10px]">
                {supportTicketPriorities.map((p) => {
                  const selected = form.priority === p.id
                  return (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center gap-[8px] rounded-[9px] border px-[12px] py-[9px] text-[13px] font-medium transition-colors ${
                        selected ? 'border-brand text-ink' : 'border-line text-ink hover:bg-[#F4F7FB]'
                      }`}
                    >
                      <span
                        className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                          selected ? 'border-ok' : 'border-[#C5D0DC]'
                        }`}
                        aria-hidden
                      >
                        {selected ? <span className="h-[8px] w-[8px] rounded-full bg-ok" /> : null}
                      </span>
                      <input
                        type="radio"
                        name="priority"
                        value={p.id}
                        checked={selected}
                        onChange={() => set('priority')(p.id)}
                        className="sr-only"
                      />
                      {p.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <FileUploadArea files={files} onChange={setFiles} />
          </FormSection>
        </div>

        <div className="shrink-0 px-[22px] pb-[22px] pt-[16px]">
          {error && (
            <p role="alert" className="mb-[12px] text-[12.5px] leading-4 text-danger">
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-[10px]">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {submitting ? 'Creating…' : 'Create Ticket'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
