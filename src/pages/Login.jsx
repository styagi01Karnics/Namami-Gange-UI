import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgOverlay from '../assets/login/bg-overlay.png'
import bgPhoto from '../assets/login/bg-photo.png'
import logoHindi from '../assets/logo-namami-gange.png'
import personIcon from '../assets/login/person.svg'
import lockIcon from '../assets/login/lock.svg'
import eyeOffIcon from '../assets/login/eye-off.svg'
import orLine from '../assets/login/or-line.svg'
import wave from '../assets/login/wave.svg'
import shieldCheck from '../assets/login/shield-check.svg'
import shieldFooter from '../assets/login/shield-footer.svg'
import personAccounts from '../assets/login/person-accounts.svg'
import fingerprint from '../assets/login/fingerprint.svg'
import support from '../assets/login/support.svg'
import divider from '../assets/login/divider.svg'

const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'admin'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      setError('Invalid username or password. Please try again.')
      return
    }

    setError('')
    sessionStorage.setItem('ng-auth', '1')
    navigate('/dashboard')
  }

  const inputBorderClass = error ? 'border-[#dc2626]' : 'border-[#e5e7e6]'

  return (
    <div className="relative min-h-[1024px] w-full overflow-hidden bg-[#002150]" data-node-id="604:4911">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img alt="" className="absolute size-full max-w-none object-cover" src={bgOverlay} />
        <div className="absolute inset-0 overflow-hidden opacity-70">
          <img alt="" className="absolute size-full max-w-none object-cover" src={bgPhoto} />
        </div>
      </div>

      {/* Left brand copy */}
      <div className="absolute left-[74px] top-[200px] h-[113px] w-[140px]" data-node-id="604:4942">
        <img alt="Namami Gange" className="size-full max-w-none object-contain object-left" src={logoHindi} />
      </div>
      <p
        className="absolute left-[74px] top-[307px] whitespace-nowrap text-[24px] font-[540] leading-[33px] text-[#f7f8fa]"
        style={{ fontVariationSettings: '"wdth" 60' }}
        data-node-id="604:4937"
      >
        Namami Gange
      </p>
      <p
        className="absolute left-[74px] top-[360px] whitespace-nowrap font-deva text-[54px] font-[590] leading-[64px] text-[#f7f8fa]"
        data-node-id="604:4940"
      >
        स्वच्छ गंगा
      </p>
      <p
        className="absolute left-[74px] top-[424px] whitespace-nowrap font-deva text-[54px] font-[590] leading-[64px] text-[#f7941d]"
        data-node-id="604:4941"
      >
        समृद्ध भारत
      </p>
      <div className="absolute left-[74px] top-[501px] h-[8px] w-[95px]" data-node-id="604:4943">
        <img alt="" className="block size-full max-w-none" src={wave} />
      </div>
      <p
        className="absolute left-[74px] top-[522px] whitespace-nowrap font-deva text-[20px] font-[590] leading-[33px] text-[#25a8e0]"
        data-node-id="604:4938"
      >
        रियल-टाइम मॉनिटरिंग • स्मार्ट एनालिटिक्स • सतत भविष्य
      </p>
      <p
        className="absolute left-[74px] top-[581px] w-[535px] text-[20px] font-[590] leading-[32px] text-[#f7f8fa]"
        data-node-id="604:4939"
      >
        A unified platform for real-time monitoring and management of Sewage Treatment Plants across India.
      </p>

      {/* Login card */}
      <form
        onSubmit={handleSignIn}
        className="absolute left-[calc(50%+426px)] top-[calc(50%-90px)] h-[736px] w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[23.226px] bg-[#f7f8fa] backdrop-blur-[1.694px]"
        data-node-id="604:4912"
      >
        <p
          className="absolute left-[calc(50%-92px)] top-[52px] whitespace-nowrap text-[27.097px] font-[590] leading-[31.946px] text-[#003c7a]"
          data-node-id="604:4930"
        >
          Namami Gange
        </p>
        <p
          className="absolute left-[calc(50%-139px)] top-[97px] whitespace-nowrap text-[17.419px] font-[510] leading-[1.5] text-[#646464]"
          data-node-id="604:4915"
        >
          Smart STP Dashboard Monitoring
        </p>

        <div className={`absolute left-[31px] top-[166px] h-[54px] w-[418px] rounded-[7.742px] border-[0.968px] border-solid bg-[rgba(255,255,255,0.7)] ${inputBorderClass}`} data-node-id="604:4913">
          <div className="absolute left-[16px] top-[15px] size-[23px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={personIcon} />
          </div>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value)
              if (error) setError('')
            }}
            placeholder="Username"
            className="absolute inset-0 bg-transparent pl-[46px] pr-[16px] text-[15.484px] font-[510] text-[#07121e] outline-none placeholder:text-[#7e7e7e]"
            data-node-id="604:4916"
          />
        </div>

        <div className={`absolute left-[31px] top-[244px] h-[54px] w-[418px] rounded-[7.742px] border-[0.968px] border-solid bg-[rgba(255,255,255,0.7)] ${inputBorderClass}`} data-node-id="604:4914">
          <div className="absolute left-[16px] top-[15px] size-[23px] overflow-hidden">
            <img alt="" className="absolute inset-0 size-full max-w-none" src={lockIcon} />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (error) setError('')
            }}
            placeholder="Password"
            className="absolute inset-0 bg-transparent pl-[46px] pr-[48px] text-[15.484px] font-[510] text-[#07121e] outline-none placeholder:text-[#7e7e7e]"
            data-node-id="604:4917"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-[12px] top-[15px] size-[23px] cursor-pointer border-0 bg-transparent p-0"
            onClick={() => setShowPassword((v) => !v)}
            data-node-id="604:4919"
          >
            <img alt="" className="size-full max-w-none" src={eyeOffIcon} />
          </button>
        </div>

        {error ? (
          <p
            role="alert"
            className="absolute left-[31px] top-[308px] w-[418px] text-[13px] font-[510] leading-[18px] text-[#dc2626]"
          >
            {error}
          </p>
        ) : null}

        <label className="absolute left-[31px] top-[321px] flex cursor-pointer items-center gap-[10px]" data-node-id="604:4925">
          <span className="relative size-[17.419px] rounded-[3.871px] border-[0.484px] border-solid border-[#5d6067]">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="absolute inset-0 m-0 cursor-pointer opacity-0"
            />
            {rememberMe ? (
              <span className="absolute inset-[3px] rounded-[2px] bg-[#003c7a]" />
            ) : null}
          </span>
          <span className="text-[13.548px] font-[510] text-[#07121e]" data-node-id="604:4922">
            Remember me
          </span>
        </label>
        <button
          type="button"
          className="absolute left-[332px] top-[321px] cursor-pointer border-0 bg-transparent p-0 text-[13.548px] font-[510] text-[#003c7a]"
          data-node-id="604:4924"
        >
          Forgot Password?
        </button>

        <button
          type="submit"
          className="absolute left-[31px] top-[378px] h-[54px] w-[418px] cursor-pointer rounded-[30.968px] border-0 bg-gradient-to-r from-[#0668d2] to-[#003c7a] text-[16.86px] font-semibold text-white"
          data-node-id="604:4927"
        >
          Sign in
        </button>

        <img alt="" className="absolute left-[31px] top-[460px] h-px w-[187px]" src={orLine} data-node-id="604:4932" />
        <p className="absolute left-[calc(50%-8px)] top-[452px] text-[13.548px] font-[510] text-[#7e7e7e]" data-node-id="604:4923">
          Or
        </p>
        <img alt="" className="absolute left-[262px] top-[460px] h-px w-[187px]" src={orLine} data-node-id="604:4931" />

        <button
          type="button"
          className="absolute left-[31px] top-[492px] h-[54px] w-[418px] cursor-pointer rounded-[30.968px] border-[0.968px] border-solid border-[#0375bc] bg-[#fdfdfe] text-[16.86px] font-semibold text-[#0375bc]"
          data-node-id="604:4929"
        >
          SSO Login
        </button>

        <div className="absolute left-[31px] top-[577px] h-[108px] w-[418px] rounded-[7.742px] bg-[#eff5f1]" data-node-id="604:4933">
          <div className="absolute left-[24px] top-[31px] size-[46px] overflow-hidden" data-node-id="604:4934">
            <img alt="" className="absolute left-[4px] top-[3px] h-[41px] w-[39px] max-w-none" src={shieldCheck} />
          </div>
          <p className="absolute left-[105px] top-[23px] text-[15.484px] font-[590] text-[#0e3a2b]" data-node-id="604:4935">
            Secure • Reliable • Responsible
          </p>
          <p className="absolute left-[105px] top-[51px] w-[334px] text-[13.548px] font-[510] text-[#7e7e7e]" data-node-id="604:4936">
            Committed to protection of data and sustainable environment
          </p>
        </div>
      </form>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 h-[180px] w-full bg-[rgba(0,33,80,0.7)]" data-node-id="609:5390">
        <div className="absolute left-[79px] top-[29px] size-[32px] overflow-hidden" data-node-id="609:5395">
          <img alt="" className="absolute left-[3px] top-[2px] h-[28px] w-[27px] max-w-none" src={shieldFooter} />
        </div>
        <p className="absolute left-[107px] top-[65px] w-[190px] text-[16px] leading-[24px] text-white" data-node-id="609:5391">
          Role-based access with secure authentication
        </p>

        <div className="absolute left-[428px] top-[29px] size-[32px] overflow-hidden" data-node-id="609:5398">
          <img alt="" className="absolute left-[2px] top-[2px] h-[28px] w-[28px] max-w-none" src={personAccounts} />
        </div>
        <p className="absolute left-[456px] top-[65px] w-[213px] text-[16px] leading-[24px] text-white" data-node-id="609:5392">
          Every login is logged for transparency & compliance
        </p>

        <div className="absolute left-[786px] top-[29px] size-[32px] overflow-hidden" data-node-id="609:5397">
          <img alt="" className="absolute left-[4px] top-[3px] h-[25px] w-[24px] max-w-none" src={fingerprint} />
        </div>
        <p className="absolute left-[814px] top-[65px] w-[216px] text-[16px] leading-[24px] text-white" data-node-id="609:5393">
          OTP, Biometric & encryption for enhanced security
        </p>

        <div className="absolute left-[1164px] top-[29px] size-[32px] overflow-hidden" data-node-id="609:5396">
          <img alt="" className="absolute left-[4px] top-[2px] h-[28px] w-[24px] max-w-none" src={support} />
        </div>
        <p className="absolute left-[1192px] top-[65px] w-[181px] text-[16px] leading-[24px] text-white" data-node-id="609:5394">
          We are here to help you anytime, anywhere
        </p>

        <div className="absolute left-1/2 top-[117px] flex h-[39px] w-[441px] -translate-x-1/2 items-center justify-center gap-[24px] rounded-[8px] bg-white" data-node-id="609:5399">
          <span className="text-center text-[16px] font-medium text-[#002250]" data-node-id="609:5400">
            Version 1.0
          </span>
          <img alt="" className="h-[19px] w-px" src={divider} />
          <span className="text-center text-[16px] font-medium text-[#002250]" data-node-id="609:5401">
            Developed by Karnics Technologies
          </span>
        </div>
      </div>
    </div>
  )
}
