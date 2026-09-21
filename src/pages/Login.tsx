import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { ico } from '../components/ui/Ico'
import SupportIcon from '../components/ui/SupportIcon'
import Logo from '../components/ui/Logo'
import { useAuth } from '../auth/AuthContext'

const PersonIcon = ico('fluent:person-24-regular')
const LockIcon = ico('fluent:lock-closed-24-regular')
const ShieldIcon = ico('fluent:shield-checkmark-32-filled')
const FingerprintIcon = ico('fluent:fingerprint-24-filled')
const UserRoundIcon = ico('fluent:person-32-filled')

const FOOTER = [
  { icon: ShieldIcon, lines: ['Role-based access with', 'secure authentication'] },
  { icon: UserRoundIcon, lines: ['Every login is logged for', 'transparency & compliance'] },
  { icon: FingerprintIcon, lines: ['OTP, Biometric & encryption', 'for enhanced security'] },
  { icon: SupportIcon, lines: ['We are here to help you', 'anytime, anywhere'] },
]

/** The hand-drawn blue underline that sits beneath the Hindi headline. */
function Squiggle() {
  return (
    <svg width="100" height="12" viewBox="0 0 86 10" fill="none" className="mt-[8px] shrink-0 lg:mt-[12px]">
      <path
        d="M2 6.2c6-4.6 12-4.6 18 0s12 4.6 18 0 12-4.6 18 0 12 4.6 18 0"
        stroke="#4BA3E3"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AuthField({ icon: Icon, type = 'text', value, onChange, placeholder, trailing = null }) {
  return (
    <label className="relative block">
      <Icon
        size={18}
        strokeWidth={1.8}
        className="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 text-[#98A5B4]"
      />
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-11 w-full rounded-[12px] border border-[#E3E9F0] bg-white pl-[46px] pr-[46px] text-[15px] text-ink outline-none transition-colors placeholder:text-[#98A5B4] focus:border-brand [@media(min-height:820px)]:h-[56px] [@media(min-height:820px)]:text-[16px] [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden"
      />
      {trailing}
    </label>
  )
}

const LOGIN_ROLES = [
  { id: 'vendor', label: 'Vendor Login' },
  { id: 'admin', label: 'Admin Login' },
]

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loginRole, setLoginRole] = useState('admin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(username.trim(), password, remember)) {
      navigate('/dashboard', { replace: true })
      return
    }
    setError('Invalid username or password.')
  }

  return (
    <div className="fixed inset-0 flex h-dvh max-h-dvh flex-col overflow-hidden bg-[#0B2545]">
      {/* Background photo + left-to-right gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <img src="/loginbg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-[#0B2545]/35 to-[#1668E3]/50" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center gap-6 px-4 py-3 sm:px-8 sm:py-4 lg:justify-between lg:gap-10 lg:px-12 xl:px-16 [@media(min-height:820px)]:py-6">
        {/* Left hero — hidden on small widths so the form always fits */}
        <section className="relative hidden min-h-0 max-w-[560px] shrink text-white lg:block">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[48px] -inset-y-[40px] -z-10 rounded-[40px] bg-[#0B2545]/45 blur-[46px]"
          />

          <span className="block">
            <Logo hero className="-ml-[40px] block max-h-[72px] [@media(min-height:820px)]:max-h-[104px]" />
            <span className="mt-1 block text-[13px] font-bold leading-5 tracking-[0.08em] text-white sm:text-[15px]">
              NAMAMI GANGE
            </span>
          </span>

          <h1 className="font-deva mt-4 text-[32px] font-extrabold leading-[1.28] tracking-tight xl:text-[42px] [@media(min-height:820px)]:mt-6 [@media(min-height:820px)]:text-[46px]">
            <span className="block text-white">स्वच्छ गंगा</span>
            <span className="block text-orange">समृद्ध भारत</span>
          </h1>

          <Squiggle />

          <p className="font-deva mt-2 text-[14px] font-semibold leading-6 text-[#7FC0F0] xl:text-[16px] [@media(min-height:820px)]:mt-3 [@media(min-height:820px)]:text-[17px]">
            रियल-टाइम मॉनिटरिंग • स्मार्ट एनालिटिक्स • सतत भविष्य
          </p>

          <p className="mt-3 max-w-[500px] text-[15px] font-medium leading-6 text-white xl:text-[17px] xl:leading-7 [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:text-[18px] [@media(min-height:820px)]:leading-[30px]">
            A unified platform for real-time monitoring and management of Sewage Treatment Plants across India.
          </p>
        </section>

        {/* Sign-in card */}
        <section className="flex w-full max-w-[480px] shrink-0 flex-col rounded-[20px] bg-white px-5 py-4 shadow-pop sm:px-8 sm:py-5 xl:max-w-[520px] [@media(min-height:820px)]:px-[42px] [@media(min-height:820px)]:py-8">
          <h2 className="bg-gradient-to-r from-[#1668E3] to-[#EE9B2C] bg-clip-text text-center text-[22px] font-bold leading-8 text-transparent sm:text-[26px] [@media(min-height:820px)]:text-[28px] [@media(min-height:820px)]:leading-9">
            Namami Gange
          </h2>
          <p className="mt-1 text-center text-[13px] leading-5 text-ink-soft sm:text-[15px] [@media(min-height:820px)]:text-[16px]">
            Smart STP Dashboard Monitoring
          </p>

          <div
            role="group"
            aria-label="Login type"
            className="mt-3 grid grid-cols-2 gap-2 rounded-[12px] bg-[#DFEFFF] p-[5px] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:gap-[10px] [@media(min-height:820px)]:p-[6px]"
          >
            {LOGIN_ROLES.map((role) => {
              const selected = loginRole === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setLoginRole(role.id)}
                  aria-pressed={selected}
                  className={`h-9 rounded-[9px] text-[13px] font-semibold leading-5 transition-colors sm:text-[14px] [@media(min-height:820px)]:h-[44px] [@media(min-height:820px)]:text-[14.5px] ${
                    selected
                      ? 'bg-[#003C7A] text-white shadow-sm'
                      : 'bg-[#DFEFFF] text-[#003C7A] hover:bg-white/70'
                  }`}
                >
                  {role.label}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-3 space-y-3 [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:space-y-[18px]">
            <AuthField
              icon={PersonIcon}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="Username"
            />

            <AuthField
              icon={LockIcon}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Password"
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#98A5B4] transition-colors hover:text-brand"
                >
                  {showPassword ? <EyeOff size={19} strokeWidth={1.8} /> : <Eye size={19} strokeWidth={1.8} />}
                </button>
              }
            />

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded-[3px] border-[#C7D2DF] accent-brand"
                />
                <span className="text-[13px] leading-5 text-ink-soft sm:text-[14px]">Remember me</span>
              </label>
              <button type="button" className="text-[13px] font-medium leading-5 text-brand-link hover:underline sm:text-[14px]">
                Forgot Password?
              </button>
            </div>

            {error && <p className="text-[13px] leading-5 text-danger">{error}</p>}

            <button
              type="submit"
              className="flex h-11 w-full items-center justify-center rounded-full text-[15px] font-semibold text-white transition-opacity hover:opacity-95 [@media(min-height:820px)]:mt-2 [@media(min-height:820px)]:h-[56px] [@media(min-height:820px)]:text-[17px]"
              style={{ background: 'linear-gradient(90deg, #0668D2 0%, #003C7A 100%)' }}
            >
              Sign in
            </button>
          </form>

          <p className="my-2 text-center text-[12px] leading-5 text-ink-muted [@media(min-height:820px)]:my-3">Or</p>

          <button
            type="button"
            className="flex h-11 w-full items-center justify-center rounded-full border border-brand bg-white text-[15px] font-semibold text-brand transition-colors hover:bg-brand-soft [@media(min-height:820px)]:h-[56px] [@media(min-height:820px)]:text-[17px]"
          >
            SSO Login
          </button>

          <div className="mt-3 rounded-[12px] bg-[#EFF5F1] px-4 py-3 [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:px-5 [@media(min-height:820px)]:py-4">
            <div className="flex items-center gap-3">
              <ShieldIcon size={32} className="shrink-0 text-ok [@media(min-height:820px)]:h-10 [@media(min-height:820px)]:w-10" />
              <p className="leading-5">
                <span className="text-[13px] font-semibold text-ink sm:text-[14px] [@media(min-height:820px)]:text-[15px]">
                  Secure • Reliable • Responsible
                </span>
                <br />
                <span className="text-[12px] text-ink-soft sm:text-[13px] [@media(min-height:820px)]:text-[14px]">
                  Committed to protection of data and sustainable environment
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom banner — compact strip that never forces page scroll */}
      <footer className="relative z-10 shrink-0 overflow-hidden bg-[#051937]/90 px-4 py-2.5 sm:px-8 sm:py-3 [@media(min-height:820px)]:px-10 [@media(min-height:820px)]:pb-4 [@media(min-height:820px)]:pt-5">
        <div className="relative z-10">
          <div className="mx-auto hidden max-w-[1400px] grid-cols-2 gap-x-8 gap-y-3 sm:grid xl:grid-cols-4 xl:gap-x-16 [@media(min-height:820px)]:gap-y-4">
            {FOOTER.map(({ icon: Icon, lines }) => (
              <p key={lines[0]} className="flex items-center gap-3 text-[12px] leading-[16px] text-white [@media(min-height:820px)]:gap-[15px] [@media(min-height:820px)]:text-[14px] [@media(min-height:820px)]:leading-[18px]">
                <Icon size={20} className="shrink-0 text-white [@media(min-height:820px)]:h-[25px] [@media(min-height:820px)]:w-[25px]" />
                <span>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </p>
            ))}
          </div>

          <p className="mx-auto w-fit rounded-[9px] bg-white px-3 py-1.5 text-[11px] font-medium leading-4 text-[#051937] sm:mt-3 [@media(min-height:820px)]:mt-4 [@media(min-height:820px)]:px-[18px] [@media(min-height:820px)]:py-2 [@media(min-height:820px)]:text-[12px]">
            Version 1.0 <span className="mx-2 text-[#C7D2DF]">|</span> Developed by Karnics Technologies
          </p>
        </div>
      </footer>
    </div>
  )
}
