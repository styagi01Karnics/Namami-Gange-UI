/** Inline placeholder portrait — swap for a real <img src={user.photo} />. */
export default function Avatar({ size = 36, className = '' }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} className={`shrink-0 rounded-full ${className}`}>
      <circle cx="18" cy="18" r="18" fill="#DCEAFB" />
      <circle cx="18" cy="14" r="5.4" fill="#F0C9A4" />
      <path
        d="M18 20.5c-5.2 0-9.2 3-9.6 7.4A18 18 0 0 0 18 36c3.7 0 7.1-1.1 9.6-3.1-.4-4.4-4.4-8.4-9.6-8.4Z"
        fill="#2F5D8C"
      />
      <path
        d="M12.4 12.2c0-3.1 2.5-5.6 5.6-5.6s5.6 2.5 5.6 5.6l-1.6.6c-.7-2-2.3-3-4-3s-3.3 1-4 3l-1.6-.6Z"
        fill="#2C3644"
      />
    </svg>
  )
}
