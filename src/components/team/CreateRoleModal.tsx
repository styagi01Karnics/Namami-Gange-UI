import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, RefreshCw, X } from 'lucide-react'
import Button from '../ui/Button'
import Select from '../ui/Select'
import BuildingIcon from '../ui/BuildingIcon'
import CctvIcon from '../ui/CctvIcon'
import DashboardIcon from '../ui/DashboardIcon'
import ReportsIcon from '../ui/ReportsIcon'
import SettingsIcon from '../ui/SettingsIcon'
import SupportIcon from '../ui/SupportIcon'
import TeamIcon from '../ui/TeamIcon'
import { ico } from '../ui/Ico'
import { tint } from './teamTheme'
import { fetchRole, fetchRoleCatalog, type Catalog } from '../../api/roles'

const MODULE_ICONS: Record<string, any> = {
  dashboard: DashboardIcon,
  stp: BuildingIcon,
  building: BuildingIcon,
  cctv: CctvIcon,
  camera: CctvIcon,
  support: SupportIcon,
  reports: ReportsIcon,
  team: TeamIcon,
  settings: SettingsIcon,
}

const MODULE_COLORS: Record<string, string> = {
  dashboard: '#2563EB',
  stp: '#15803D',
  cctv: '#B45309',
  support: '#7C3AED',
  reports: '#DC2626',
  team: '#EA580C',
  settings: '#15803D',
}

const FileTextIcon = ico('famicons:document-sharp')
const KeyIcon = ico('fluent:key-24-filled')
const RoleIcon = ico('fluent:person-board-32-filled')

const EMPTY = { role: '', description: '', status: 'Active', template: '' }

function Checkbox({ checked, onChange, label, className = '' }: any) {
  return (
    <label className={`flex cursor-pointer items-center gap-[9px] text-[12.5px] leading-4 text-ink ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-[15px] w-[15px] shrink-0 accent-brand"
      />
      {label}
    </label>
  )
}

/** Light blue strip that separates the two halves of the form. */
function FormSection({ icon: Icon, title, children }: any) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-line">
      <header className="flex items-center gap-[9px] bg-[#EEF5FE] px-[16px] py-[11px]">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] bg-[#D6E8FC] text-[#2F7CD6]">
          <Icon size={13} strokeWidth={2} />
        </span>
        <h3 className="text-[13px] font-bold leading-[18px] text-brand">{title}</h3>
      </header>
      <div className="px-[16px] pb-[16px] pt-[16px]">{children}</div>
    </section>
  )
}

function ModuleRow({ module, selected, onToggleModule, onTogglePermission }: any) {
  const [open, setOpen] = useState(false)
  const Icon = MODULE_ICONS[module.icon] ?? MODULE_ICONS[module.id] ?? DashboardIcon
  const color = module.color ?? MODULE_COLORS[module.id] ?? '#2563EB'
  const permissions = module.permissions || []
  const count = permissions.length || 1
  const all = permissions.length > 0 && permissions.every((p: string) => selected.includes(p))

  return (
    <div className="rounded-[10px] border border-line">
      <div className="flex items-center gap-[11px] px-[13px] py-[11px]">
        <input
          type="checkbox"
          checked={permissions.length === 0 ? selected.length > 0 : all}
          onChange={(e) => onToggleModule(e.target.checked)}
          aria-label={module.label}
          className="h-[15px] w-[15px] shrink-0 accent-brand"
        />

        <span
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: tint(color, 0.12), color }}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold leading-[18px]" style={{ color }}>
            {module.label}
          </span>
          <span className="block truncate text-[11.5px] leading-4 text-ink-muted">{module.blurb}</span>
        </span>

        <span className="flex shrink-0 items-center gap-[8px]">
          <span className="inline-flex min-w-[118px] justify-center rounded-full bg-brand-soft px-[10px] py-[3px] text-center text-[11.5px] font-medium leading-4 text-brand">
            {count} {count === 1 ? 'permission' : 'permissions'}
          </span>
          {permissions.length > 0 ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={`Toggle ${module.label} permissions`}
              className="flex h-4 w-4 shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-brand"
            >
              <ChevronDown size={16} strokeWidth={2.2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <span className="h-4 w-4 shrink-0" aria-hidden />
          )}
        </span>
      </div>

      {open && permissions.length > 0 && (
        <div className="grid grid-cols-3 gap-x-[14px] gap-y-[11px] border-t border-line bg-[#F8FAFD] px-[13px] py-[12px]">
          {permissions.map((permission: string) => (
            <Checkbox
              key={permission}
              label={permission}
              checked={selected.includes(permission)}
              onChange={(next: boolean) => onTogglePermission(permission, next)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreateRoleModal({ open, onClose, onSubmit, role = null }: any) {
  const [form, setForm] = useState(EMPTY)
  const [granted, setGranted] = useState<Record<string, string[]>>({})
  const [catalog, setCatalog] = useState<Catalog | null>(null)
  const [catalogLoading, setCatalogLoading] = useState(false)
  const [catalogError, setCatalogError] = useState('')
  const [loadingRole, setLoadingRole] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const editing = Boolean(role)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  // Endpoint 2: GET /api/roles/catalog exclusively from database
  useEffect(() => {
    if (!open) return
    setCatalogLoading(true)
    setCatalogError('')
    fetchRoleCatalog()
      .then((cat) => {
        if (cat) setCatalog(cat)
      })
      .catch((err) => {
        console.error('Failed to load role catalog from database:', err)
        setCatalogError(err?.message || 'Failed to load permission catalog from database.')
      })
      .finally(() => {
        setCatalogLoading(false)
      })
  }, [open])

  useEffect(() => {
    if (!open) {
      setForm(EMPTY)
      setGranted({})
      setSubmitError('')
      return
    }

    if (role) {
      setForm({
        role: role.name || '',
        description: role.description ?? '',
        status: role.statusLabel ?? role.status ?? 'Active',
        template: role.permissionLabel ?? role.permissionPreset ?? role.template ?? '',
      })
      setGranted(role.granted || {})

      // Endpoint 3: GET /api/roles/{id} from database
      if (role.id) {
        setLoadingRole(true)
        fetchRole(role.id)
          .then((detail) => {
            if (detail) {
              setForm({
                role: detail.name || role.name,
                description: detail.description ?? role.description ?? '',
                status: detail.statusLabel || detail.status || role.status || 'Active',
                template: detail.permissionLabel || detail.permissionPreset || role.template || '',
              })
              if (detail.granted) {
                setGranted(detail.granted)
              }
            }
          })
          .catch((err) => {
            console.error('Failed to fetch role details from database:', err)
            setSubmitError(err?.message || 'Could not fetch role details from database.')
          })
          .finally(() => {
            setLoadingRole(false)
          })
      }
      return
    }

    setForm(EMPTY)
    setGranted({})
    setSubmitError('')
  }, [open, role])

  const total = useMemo(() => Object.values(granted).reduce((n, list) => n + (list?.length || 0), 0), [granted])

  const set = (key: string) => (value: any) => setForm((prev) => ({ ...prev, [key]: value }))
  const canSubmit = form.role.trim() && form.description.trim()

  const modulesList = catalog?.modules || []
  const statusesList = catalog?.statuses?.length ? catalog.statuses.map((s) => s.label) : ['Active', 'Inactive']
  const templatesList = useMemo(() => {
    const list = catalog?.permissionPresets?.length ? catalog.permissionPresets.map((p) => p.label) : []
    return [...list, 'Custom']
  }, [catalog?.permissionPresets])

  // Modules without sub-permissions count as a single "module" grant.
  const toggleModule = (module: any, checked: boolean) =>
    setGranted((prev) => ({
      ...prev,
      [module.id]: checked
        ? (module.permissions && module.permissions.length > 0 ? module.permissions : [module.label])
        : [],
    }))

  const togglePermission = (module: any, permission: string, checked: boolean) =>
    setGranted((prev) => {
      const current = prev[module.id] ?? []
      return {
        ...prev,
        [module.id]: checked ? [...current, permission] : current.filter((p) => p !== permission),
      }
    })

  const handleTemplateChange = (templateName: string) => {
    set('template')(templateName)
    if (!templateName || templateName === 'Custom') return

    // Find preset in database catalog presetGrants
    if (catalog?.presetGrants) {
      const presetItem = catalog.permissionPresets?.find(
        (p) =>
          p.label.toLowerCase() === templateName.toLowerCase() ||
          p.id.toLowerCase() === templateName.toLowerCase(),
      )
      const key = presetItem?.id || templateName.toUpperCase().replace(/\s+/g, '_')
      const grants = catalog.presetGrants[key] || catalog.presetGrants[templateName]
      if (grants) {
        setGranted(grants)
      }
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) return
    try {
      setSubmitting(true)
      setSubmitError('')

      // 1. Determine status ("ACTIVE" / "INACTIVE")
      const matchedStatus = catalog?.statuses?.find(
        (s) => s.label.toLowerCase() === form.status.toLowerCase() || s.id.toLowerCase() === form.status.toLowerCase(),
      )
      const statusValue = matchedStatus ? matchedStatus.id : (form.status.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE')

      // 2. Clean granted object (remove modules with empty arrays)
      const cleanedGranted: Record<string, string[]> = {}
      Object.entries(granted).forEach(([modKey, perms]) => {
        if (Array.isArray(perms) && perms.length > 0) {
          cleanedGranted[modKey] = perms
        }
      })

      // 3. Resolve preset
      const isCustom = !form.template || form.template === 'Custom'
      let matchedPreset: string | undefined = undefined
      if (!isCustom) {
        const found = catalog?.permissionPresets?.find(
          (p) =>
            p.label.toLowerCase() === form.template.toLowerCase() ||
            p.id.toLowerCase() === form.template.toLowerCase(),
        )
        matchedPreset = found ? found.label : form.template
      }

      // 4. Construct payload according to API endpoints specs
      const payload: any = {
        name: form.role.trim(),
        description: form.description.trim(),
        status: statusValue,
      }

      if (matchedPreset) {
        payload.permissionPreset = matchedPreset
        if (Object.keys(cleanedGranted).length > 0) {
          payload.granted = cleanedGranted
        }
      } else {
        payload.granted = cleanedGranted
      }

      await onSubmit(payload)
      onClose()
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to save role to database. Please check role-service.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex items-start justify-between gap-[12px] px-[22px] pb-[8px] pt-[22px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-[#F0EBFD] text-[#7C3AED]">
              <RoleIcon size={17} className="text-[#7C3AED]" />
            </span>
            <div>
              <h2 id="role-modal-title" className="text-[16px] font-extrabold leading-6 text-ink">
                {editing ? 'Edit Role' : 'Create Role'}
              </h2>
              {loadingRole && (
                <p className="text-[12px] text-ink-muted">Loading role details from database...</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[28px] w-[28px] items-center justify-center rounded-[8px] border border-line text-ink-soft hover:text-brand"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="scroll-thin mt-[16px] max-h-[68vh] space-y-[16px] overflow-y-auto px-[22px] pb-[8px]">
          {submitError && (
            <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12.5px] leading-5 text-red-600">
              {submitError}
            </div>
          )}

          {catalogError && (
            <div className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-[12.5px] leading-5 text-red-600">
              Database Error: {catalogError}
            </div>
          )}

          <FormSection icon={FileTextIcon} title="Role & Access">
            <div className="space-y-[16px]">
              <label className="block">
                <span className="mb-[10px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Role *</span>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => set('role')(e.target.value)}
                  placeholder="Enter Role"
                  className="w-full rounded-[9px] border border-line bg-white px-[13px] py-[10px] text-[13px] leading-5 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
                />
              </label>

              <label className="block">
                <span className="mb-[10px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Description *</span>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description')(e.target.value)}
                  placeholder="Add Details"
                  rows={3}
                  className="w-full resize-none rounded-[9px] border border-line bg-white px-[13px] py-[10px] text-[13px] leading-5 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
                />
              </label>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <span className="mb-[10px] block text-[12.5px] font-semibold leading-4 text-ink-soft">Status *</span>
                  <Select options={statusesList} value={form.status} onChange={set('status')} />
                </div>
                <div>
                  <span className="mb-[10px] block text-[12.5px] font-semibold leading-4 text-ink-soft">
                    Permission Template
                  </span>
                  <Select
                    options={templatesList}
                    dropUp
                    value={form.template}
                    onChange={handleTemplateChange}
                    placeholder={catalogLoading ? 'Loading templates...' : 'Select a template'}
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon={KeyIcon} title="Module Permissions">
            {catalogLoading ? (
              <div className="flex items-center justify-center py-6 text-[13px] text-ink-soft">
                <RefreshCw size={16} className="mr-2 animate-spin text-brand" />
                Loading permissions catalog from database...
              </div>
            ) : modulesList.length === 0 ? (
              <div className="py-4 text-center text-[13px] text-ink-muted">
                {catalogError ? 'Unable to load permissions.' : 'No modules defined in catalog.'}
              </div>
            ) : (
              <div className="space-y-[12px]">
                {modulesList.map((module) => (
                  <ModuleRow
                    key={module.id}
                    module={module}
                    selected={granted[module.id] ?? []}
                    onToggleModule={(checked: boolean) => toggleModule(module, checked)}
                    onTogglePermission={(permission: string, checked: boolean) =>
                      togglePermission(module, permission, checked)
                    }
                  />
                ))}
              </div>
            )}
          </FormSection>
        </div>

        <div className="flex items-center justify-between gap-[12px] px-[22px] pb-[22px] pt-[18px]">
          <p className="text-[12.5px] leading-4 text-ink-soft">
            {total} permission{total === 1 ? '' : 's'} selected
          </p>
          <div className="flex items-center gap-[10px]">
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || submitting || catalogLoading}>
              {submitting ? 'Saving to database...' : editing ? 'Save Changes' : 'Create Role'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
