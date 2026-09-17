import type { ComponentType, ReactNode } from 'react'

export type IconProps = {
  size?: number
  className?: string
  strokeWidth?: number
}

export type IconComponent = ComponentType<IconProps>

export type TitleCrumb = string | { label: string; to: string }
export type PageTitle = string | TitleCrumb[]

export type SelectOption = string | { id: string; label: string }

export type TableColumn = {
  key: string
  label: string
  width?: string | number
  sortable?: boolean
}

export type TableRow = {
  id: string | number
  [key: string]: unknown
}

export type StatCardItem = {
  key: string
  label: string
  value: ReactNode
  icon: string
  tone: string
  note?: ReactNode
}
