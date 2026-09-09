export default function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-card border border-line bg-card shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
