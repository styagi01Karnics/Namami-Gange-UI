import { useState, type ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import Header, { type BreadcrumbItem } from '@/components/Header'

type AppLayoutProps = {
  children: ReactNode
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  toolbar?: ReactNode
}

export default function AppLayout({
  children,
  breadcrumbs,
  title,
  toolbar,
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-[#f4faff]">
      <div className="sticky top-0 h-screen shrink-0 p-0">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-6 pb-6 pt-8">
        <Header breadcrumbs={breadcrumbs} title={title} />
        {toolbar && <div className="mt-4">{toolbar}</div>}
        <main className="mt-4 flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  )
}
