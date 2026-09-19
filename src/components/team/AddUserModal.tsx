import { useEffect, useState } from 'react'
import { ico } from '../ui/Ico'
import Button from '../ui/Button'
import Select from '../ui/Select'
import { roleStatusOptions, teamRoleNames } from '../../data/mockData'

const TitleIcon = ico('fluent:person-add-24-filled')
const PersonalIcon = ico('fluent:person-24-filled')
const ContactIcon = ico('fluent:call-24-filled')
const AccountIcon = ico('fluent:lock-closed-24-filled')
const RoleIcon = ico('fluent:shield-24-filled')
const FieldPersonIcon = ico('fluent:person-24-regular')
const MailIcon = ico('fluent:mail-24-regular')
const LockIcon = ico('fluent:lock-closed-24-regular')
const CheckIcon = ico('fluent:checkmark-circle-24-filled')

const EMPTY = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  password: '',
  confirm: '',
  role: '',
  status: 'Active',
}

const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'letter', label: 'One letter', test: (value) => /[a-z]/.test(value) },
  { key: 'special', label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

const fieldClass =
  'h-[40px] w-full rounded-[9px] border border-line bg-white text-[13px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-brand'

function IndiaFlag() {
  return (
    <span className="relative h-[14px] w-[20px] shrink-0 overflow-hidden rounded-[2px] border border-[#E3E8EF]" aria-hidden>
      <span className="absolute inset-x-0 top-0 h-1/3 bg-[#FF9933]" />
      <span className="absolute inset-x-0 top-1/3 h-1/3 bg-white" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[#138808]" />
      <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#000080]" />
    </span>
  )
}

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
    <section className="rounded-[10px] border border-line">
      <header className="flex items-center gap-[9px] rounded-t-[10px] bg-[#EEF5FE] px-[16px] py-[11px]">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] bg-[#D6E8FC] text-[#2F7CD6]">
          <Icon size={13} />
        </span>
        <h3 className="text-[13px] font-bold leading-[18px] text-brand">{title}</h3>
      </header>
      <div className="px-[16px] pb-[16px] pt-[16px]">{children}</div>
    </section>
  )
}

function IconInput({ icon: Icon, className = '', ...props }) {
  return (
    <span className="relative block">
      <Icon size={16} className="pointer-events-none absolute left-[12px] top-1/2 -translate-y-1/2 text-ink-muted" />
      <input {...props} className={`${fieldClass} pl-[36px] pr-[13px] ${className}`} />
    </span>
  )
}

function IconSelect({ icon: Icon, options, value, onChange, placeholder, dropUp = false }) {
  return (
    <div className="relative">
      <Icon size={16} className="pointer-events-none absolute left-[12px] top-1/2 z-10 -translate-y-1/2 text-ink-muted" />
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        buttonClassName="pl-[36px]"
        chevronSize={11}
        dropUp={dropUp}
      />
    </div>
  )
}

export default function AddUserModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setForm(EMPTY)
  }, [open])

  if (!open) return null

  const set = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }))
  const rulesMet = PASSWORD_RULES.every((rule) => rule.test(form.password))
  const phoneDigits = form.phone.replace(/\D/g, '')
  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    phoneDigits.length >= 10 &&
    form.email.trim() &&
    rulesMet &&
    form.confirm === form.password &&
    form.role

  const handleSubmit = () => {
    if (!canSubmit) return
    onSubmit({
      name: `${form.firstName.trim()} ${form.lastName.trim()}`,
      phone: `+91 ${phoneDigits}`,
      email: form.email.trim(),
      role: form.role,
      status: form.status,
    })
    onClose()
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 p-[12px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[600px] rounded-[16px] bg-white p-[22px] shadow-pop"
      >
        <div className="flex items-center gap-[10px]">
          <TitleIcon size={20} className="text-brand" />
          <h2 id="add-user-title" className="text-[17px] font-extrabold leading-6 text-ink">
            Add User
          </h2>
        </div>

        <div className="mt-[18px] space-y-[14px]">
          <FormSection icon={PersonalIcon} title="Personal Information">
            <div className="grid grid-cols-2 gap-x-[16px]">
              <label className="block">
                <FieldLabel required>First Name</FieldLabel>
                <IconInput
                  icon={FieldPersonIcon}
                  value={form.firstName}
                  onChange={(e) => set('firstName')(e.target.value)}
                  placeholder="First Name"
                />
              </label>
              <label className="block">
                <FieldLabel required>Last Name</FieldLabel>
                <IconInput
                  icon={FieldPersonIcon}
                  value={form.lastName}
                  onChange={(e) => set('lastName')(e.target.value)}
                  placeholder="Last Name"
                />
              </label>
            </div>
          </FormSection>

          <FormSection icon={ContactIcon} title="Contact Information">
            <div className="grid grid-cols-2 gap-x-[16px]">
              <label className="block">
                <FieldLabel required>Contact Number</FieldLabel>
                <span className="relative block">
                  <span className="pointer-events-none absolute left-[12px] top-1/2 flex -translate-y-1/2 items-center gap-[8px] text-[13px] text-ink">
                    <IndiaFlag />
                    <span>+91</span>
                    <span className="text-line">|</span>
                  </span>
                  <input
                    value={form.phone}
                    onChange={(e) => set('phone')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    inputMode="numeric"
                    placeholder=""
                    aria-label="Contact number"
                    className={`${fieldClass} pl-[78px] pr-[13px]`}
                  />
                </span>
              </label>
              <label className="block">
                <FieldLabel required>Email</FieldLabel>
                <IconInput
                  icon={MailIcon}
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email')(e.target.value)}
                  placeholder="Enter Email Address"
                />
              </label>
            </div>
          </FormSection>

          <FormSection icon={AccountIcon} title="Account Details">
            <div className="grid grid-cols-2 gap-x-[16px]">
              <label className="block">
                <FieldLabel required>Create Password</FieldLabel>
                <IconInput
                  icon={LockIcon}
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password')(e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="new-password"
                />
              </label>
              <label className="block">
                <FieldLabel>Confirm Password</FieldLabel>
                <IconInput
                  icon={LockIcon}
                  type="password"
                  value={form.confirm}
                  onChange={(e) => set('confirm')(e.target.value)}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              </label>
            </div>

            <div className="mt-[14px] rounded-[10px] bg-[#F4F8FE] px-[16px] py-[13px]">
              <p className="text-[12.5px] font-semibold leading-4 text-ink">Password Must Contain</p>
              <ul className="mt-[10px] space-y-[7px]">
                {PASSWORD_RULES.map((rule) => {
                  const met = rule.test(form.password)
                  return (
                    <li key={rule.key} className="flex items-center gap-[8px] text-[12.5px] leading-4 text-ink">
                      {met ? (
                        <CheckIcon size={12} className="text-brand" />
                      ) : (
                        <span className="h-[12px] w-[12px] shrink-0 rounded-full border border-brand" />
                      )}
                      {rule.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          </FormSection>

          <FormSection icon={RoleIcon} title="Role & Access">
            <div className="grid grid-cols-2 gap-x-[16px]">
              <div>
                <FieldLabel required>Role</FieldLabel>
                <IconSelect
                  icon={FieldPersonIcon}
                  options={teamRoleNames}
                  value={form.role}
                  onChange={set('role')}
                  placeholder="Select Role"
                  dropUp
                />
              </div>
              <div>
                <FieldLabel required>Status</FieldLabel>
                <Select
                  options={roleStatusOptions}
                  value={form.status}
                  onChange={set('status')}
                  chevronSize={11}
                  dropUp
                />
              </div>
            </div>
          </FormSection>
        </div>

        <div className="mt-[18px] flex items-center justify-end gap-[10px]">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Create User
          </Button>
        </div>
      </div>
    </div>
  )
}
