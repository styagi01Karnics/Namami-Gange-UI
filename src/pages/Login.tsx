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
    <svg width="100" height="12" viewBox="0 0 86 10" fill="none" className="mt-[12px]">
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
        className="h-[56px] w-full rounded-[12px] border border-[#E3E9F0] bg-white pl-[46px] pr-[46px] text-[16px] text-ink outline-none transition-colors placeholder:text-[#98A5B4] focus:border-brand [&::-ms-clear]:hidden [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-strong-password-auto-fill-button]:hidden"
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
    <div className="scroll-thin fixed inset-0 flex min-h-full flex-col overflow-x-hidden overflow-y-auto bg-[#0B2545]">
      {/* Background photo + left-to-right gradient: dark on the left, blue on the right */}
      <div className="absolute inset-0 overflow-hidden">
        <img src="/loginbg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-[#0B2545]/35 to-[#1668E3]/50" />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-between gap-[40px] px-[52px] py-[36px] lg:px-[64px]">
        {/* Left hero */}
        <section className="relative max-w-[600px] text-white">
          {/* Blue wash behind the copy so it stays readable over the photo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-[64px] -inset-y-[56px] -z-10 rounded-[40px] bg-[#0B2545]/45 blur-[46px]"
          />

          {/* logo.png is only the Devanagari mark, so the wordmark sits under it */}
          <span className="block">
            {/* logo.png is padded artwork, so it needs pulling out to the text edge */}
            <Logo hero className="-ml-[54px] block" />
            <span className="mt-[8px] block text-[15px] font-bold leading-5 tracking-[0.08em] text-white">
              NAMAMI GANGE
            </span>
          </span>

          <h1 className="font-deva mt-[26px] text-[42px] font-extrabold leading-[1.28] tracking-tight lg:text-[46px]">
            <span className="block text-white">स्वच्छ गंगा</span>
            <span className="block text-orange">समृद्ध भारत</span>
          </h1>

          <Squiggle />

          <p className="font-deva mt-[14px] text-[16px] font-semibold leading-7 text-[#7FC0F0] lg:text-[17px]">
            रियल-टाइम मॉनिटरिंग • स्मार्ट एनालिटिक्स • सतत भविष्य
          </p>

          <p className="mt-[20px] max-w-[500px] text-[17px] font-medium leading-[30px] text-white lg:text-[18px]">
            A unified platform for real-time monitoring and management of Sewage Treatment Plants across India.
          </p>
        </section>

        {/* Sign-in card */}
        <section className="w-full max-w-[520px] shrink-0 rounded-[20px] bg-white px-[42px] py-[44px] shadow-pop">
          <h2
            className="bg-gradient-to-r from-[#1668E3] to-[#EE9B2C] bg-clip-text text-center text-[28px] font-bold leading-9 text-transparent"
          >
            Namami Gange
          </h2>
          <p className="mt-[6px] text-center text-[16px] leading-6 text-ink-soft">Smart STP Dashboard Monitoring</p>

          <div
            role="group"
            aria-label="Login type"
            className="mt-[22px] grid grid-cols-2 gap-[10px] rounded-[12px] bg-[#DFEFFF] p-[6px]"
          >
            {LOGIN_ROLES.map((role) => {
              const selected = loginRole === role.id
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setLoginRole(role.id)}
                  aria-pressed={selected}
                  className={`h-[44px] rounded-[9px] text-[14.5px] font-semibold leading-5 transition-colors ${
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

          <form onSubmit={handleSubmit} className="mt-[22px] space-y-[18px]">
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

            <div className="flex items-center justify-between pt-[2px]">
              <label className="flex cursor-pointer items-center gap-[8px]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-[16px] w-[16px] rounded-[3px] border-[#C7D2DF] accent-brand"
                />
                <span className="text-[14px] leading-5 text-ink-soft">Remember me</span>
              </label>
              <button type="button" className="text-[14px] font-medium leading-5 text-brand-link hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && <p className="text-[13.5px] leading-5 text-danger">{error}</p>}

            <button
              type="submit"
              className="mt-[10px] flex h-[56px] w-full items-center justify-center rounded-full text-[17px] font-semibold text-white transition-opacity hover:opacity-95"
              style={{ background: 'linear-gradient(90deg, #0668D2 0%, #003C7A 100%)' }}
            >
              Sign in
            </button>
          </form>

          <p className="my-[12px] text-center text-[12.5px] leading-5 text-ink-muted">Or</p>

          <button
            type="button"
            className="flex h-[56px] w-full items-center justify-center rounded-full border border-brand bg-white text-[17px] font-semibold text-brand transition-colors hover:bg-brand-soft"
          >
            SSO Login
          </button>

          <div className="mt-[24px] rounded-[12px] bg-[#EFF5F1] px-[20px] py-[18px]">
            <div className="flex items-center gap-[14px]">
              <ShieldIcon size={40} className="shrink-0 text-ok" />
              <p className="leading-[22px]">
                <span className="text-[15px] font-semibold text-ink">Secure • Reliable • Responsible</span>
                <br />
                <span className="text-[14px] text-ink-soft">
                  Committed to protection of data and sustainable environment
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom banner */}
      <footer className="relative z-10 shrink-0 overflow-hidden bg-gradient-to-r from-[#051937]/90 via-[#051937]/90 to-[#051937]/90 px-[40px] pb-[20px] pt-[26px]">

        <div className="relative z-10">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-[56px] gap-y-[32px] xl:grid-cols-4 xl:gap-x-[96px]">
            {FOOTER.map(({ icon: Icon, lines }) => (
              <p key={lines[0]} className="flex items-center gap-[15px] text-[14px] leading-[18px] text-white">
                <Icon size={25} className="shrink-0 text-white" />
                <span>
                  {lines[0]}
                  <br />
                  {lines[1]}
                </span>
              </p>
            ))}
          </div>

          <p className="mx-auto mt-[24px] w-fit rounded-[9px] bg-white px-[18px] py-[8px] text-[12px] font-medium leading-4 text-[#051937]">
            Version 1.0 <span className="mx-[8px] text-[#C7D2DF]">|</span> Developed by Karnics Technologies
          </p>
        </div>
      </footer>
    </div>
  )
}
