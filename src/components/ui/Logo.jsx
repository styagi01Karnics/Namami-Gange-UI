import logo from '../../assets/logo-namami-gange.png'
import logoSm from '../../assets/logo-namami-gange-sm.png'

export default function Logo({ compact = false }) {
  if (compact) {
    return (
      <img
        src={logoSm}
        alt="Namami Gange"
        className="h-10 w-10 object-contain"
      />
    )
  }

  return (
    <img
      src={logo}
      alt="Namami Gange"
      className="h-[62px] w-auto max-w-[168px] object-contain object-center"
    />
  )
}
