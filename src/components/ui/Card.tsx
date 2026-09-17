import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  className?: string
  children?: ReactNode
}

export default function Card({ className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={`rounded-card border border-line bg-card shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
