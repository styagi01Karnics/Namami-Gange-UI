import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
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
import { permissionTemplates, rolePermissionModules, roleStatusOptions, teamRoleNames } from '../../data/mockData'

const MODULE_ICONS = {
  dashboard: DashboardIcon,
  building: BuildingIcon,
  camera: CctvIcon,
  support: SupportIcon,
  reports: ReportsIcon,
  team: TeamIcon,
  settings: SettingsIcon,
}

const FileTextIcon = ico('famicons:document-sharp')
const KeyIcon = ico('fluent:key-24-filled')
const RoleIcon = ico('fluent:person-board-32-filled')

const EMPTY = { role: '', description: '', status: 'Active', template: '' }

function Checkbox({ checked, onChange, label, className = '' }) {
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
function FormSection({ icon: Icon, title, children }) {
  return (
    <section className="overflow-hidden rounded-[10px] border border-line">
      <header className="flex items-center gap-[9px] bg-[#EEF5FE] px-[14px] py-[10px]">
        <Icon size={16} strokeWidth={2} className="text-brand" />
        <h3 className="text-[13px] font-semibold leading-[18px] text-brand">{title}</h3>
      </header>
      <div className="p-[14px]">{children}</div>
    </section>
  )
}

function ModuleRow({ module, selected, onToggleModule, onTogglePermission }) {
  const [open, setOpen] = useState(false)
  const Icon = MODULE_ICONS[module.icon] ?? DashboardIcon
  const count = module.permissions.length || 1
  const all = module.permissions.length > 0 && module.permissions.every((p) => selected.includes(p))

  return (
    <div className="rounded-[10px] border border-line">
      <div className="flex items-center gap-[11px] px-[13px] py-[11px]">
        <input
          type="checkbox"
          checked={module.permissions.length === 0 ? selected.length > 0 : all}
          onChange={(e) => onToggleModule(e.target.checked)}
          aria-label={module.label}
          className="h-[15px] w-[15px] shrink-0 accent-brand"
        />

        <span
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px]"
          style={{ backgroundColor: tint(module.color, 0.12), color: module.color }}
        >
          <Icon size={16} strokeWidth={2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-semibold leading-[18px]" style={{ color: module.color }}>
            {module.label}
          </span>
          <span className="block truncate text-[11.5px] leading-4 text-ink-muted">{module.blurb}</span>
        </span>

        <span className="shrink-0 rounded-full bg-brand-soft px-[10px] py-[3px] text-[11.5px] font-medium leading-4 text-brand">
          {count} {count === 1 ? 'permission' : 'permissions'}
        </span>

        {module.permissions.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`Toggle ${module.label} permissions`}
            className="shrink-0 text-ink-soft transition-colors hover:text-brand"
          >
            <ChevronDown size={16} strokeWidth={2.2} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {open && module.permissions.length > 0 && (
        <div className="grid grid-cols-3 gap-x-[14px] gap-y-[11px] border-t border-line bg-[#F8FAFD] px-[13px] py-[12px]">
          {module.permissions.map((permission) => (
            <Checkbox
              key={permission}
              label={permission}
              checked={selected.includes(permission)}
              onChange={(next) => onTogglePermission(permission, next)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function CreateRoleModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY)
  const [granted, setGranted] = useState<Record<string, string[]>>({})

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setForm(EMPTY)
      setGranted({})
    }
  }, [open])

  const total = useMemo(() => Object.values(granted).reduce((n, list) => n + list.length, 0), [granted])

  if (!open) return null

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const canSubmit = form.role && form.description.trim()

  // Modules without sub-permissions count as a single "module" grant.
  const toggleModule = (module, checked) =>
    setGranted((prev) => ({
      ...prev,
      [module.id]: checked ? (module.permissions.length > 0 ? module.permissions : [module.label]) : [],
    }))

  const togglePermission = (module, permission, checked) =>
    setGranted((prev) => {
      const current = prev[module.id] ?? []
      return {
        ...prev,
        [module.id]: checked ? [...current, permission] : current.filter((p) => p !== permission),
      }
    })

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: form.role,
      description: form.description.trim(),
      status: form.status,
      permissions: total,
    })
    onClose()
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/45 p-[20px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-role-title"
        onClick={(e) => e.stopPropagation()}
        className="my-auto w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-pop"
      >
        <div className="flex items-start justify-between gap-[12px] px-[20px] pb-[14px] pt-[18px]">
          <div className="flex items-center gap-[10px]">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[9px] bg-[#F0EBFD] text-[#7C3AED]">
              <RoleIcon size={17} className="text-[#7C3AED]" />
            </span>
            <h2 id="create-role-title" className="text-[16px] font-bold leading-6 text-ink">
              Create Role
            </h2>
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

        <div className="scroll-thin max-h-[68vh] space-y-[14px] overflow-y-auto px-[20px] pb-[16px]">
          <FormSection icon={FileTextIcon} title="Role & Access">
            <div className="space-y-[12px]">
              <div>
                <span className="mb-[6px] block text-[12.5px] font-medium leading-4 text-ink-soft">Role *</span>
                <Select options={teamRoleNames} value={form.role} onChange={set('role')} placeholder="Select Role" />
              </div>

              <label className="block">
                <span className="mb-[6px] block text-[12.5px] font-medium leading-4 text-ink-soft">Description *</span>
                <textarea
                  value={form.description}
                  onChange={(e) => set('description')(e.target.value)}
                  placeholder="Add Details"
                  rows={3}
                  className="w-full resize-none rounded-[9px] border border-line bg-white px-[13px] py-[10px] text-[13px] leading-5 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand"
                />
              </label>

              <div className="grid grid-cols-2 gap-[12px]">
                <div>
                  <span className="mb-[6px] block text-[12.5px] font-medium leading-4 text-ink-soft">Status *</span>
                  <Select options={roleStatusOptions} value={form.status} onChange={set('status')} />
                </div>
                <div>
                  <span className="mb-[6px] block text-[12.5px] font-medium leading-4 text-ink-soft">
                    Permission Template
                  </span>
                  <Select
                    options={permissionTemplates}
                    value={form.template}
                    onChange={set('template')}
                    placeholder="Select a template"
                  />
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection icon={KeyIcon} title="Module Permissions">
            <div className="space-y-[10px]">
              {rolePermissionModules.map((module) => (
                <ModuleRow
                  key={module.id}
                  module={module}
                  selected={granted[module.id] ?? []}
                  onToggleModule={(checked) => toggleModule(module, checked)}
                  onTogglePermission={(permission, checked) => togglePermission(module, permission, checked)}
                />
              ))}
            </div>
          </FormSection>
        </div>

        <div className="flex items-center justify-between gap-[12px] border-t border-line px-[20px] py-[14px]">
          <p className="text-[12.5px] leading-4 text-ink-soft">
            {total} permission{total === 1 ? '' : 's'} selected
          </p>
          <div className="flex items-center gap-[10px]">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              Create Role
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
