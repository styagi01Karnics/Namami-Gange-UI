import iconBreadcrumb from '@/assets/shared/icon-breadcrumb-chevron.svg'
import UserActions from '@/components/UserActions'

export type BreadcrumbItem = {
  label: string
  current?: boolean
}

type HeaderProps = {
  breadcrumbs?: BreadcrumbItem[]
  title?: string
}

export default function Header({ breadcrumbs, title }: HeaderProps) {
  return (
    <header className="flex h-10 w-full items-center justify-between">
      <div className="flex items-center">
        {title ? (
          <h1 className="text-[16px] font-semibold leading-[22px] text-[#07121e]">
            {title}
          </h1>
        ) : (
          <nav className="flex items-center" aria-label="Breadcrumb">
            {breadcrumbs?.map((item, i) => (
              <div key={item.label} className="flex items-center">
                <div className="flex items-center justify-center rounded px-2 py-2">
                  <div className="flex h-6 items-center justify-center">
                    <span
                      className={
                        item.current
                          ? 'text-[16px] font-semibold leading-[22px] text-[#07121e]'
                          : 'text-[16px] font-medium leading-[22px] text-[#646464]'
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
                {i < (breadcrumbs?.length ?? 0) - 1 && (
                  <div className="relative size-5 shrink-0 overflow-clip">
                    <div className="absolute left-[calc(50%+0.75px)] top-1/2 h-[12px] w-[6.5px] -translate-x-1/2 -translate-y-1/2">
                      <img
                        src={iconBreadcrumb}
                        alt=""
                        className="absolute inset-0 block size-full max-w-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
      </div>

      <UserActions />
    </header>
  )
}
