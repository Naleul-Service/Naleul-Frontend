'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from './constants'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { cn } from '@/src/lib/utils'

export function SidebarNav() {
  const pathname = usePathname()
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-5">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        const href = item.getHref?.() ?? item.href
        const Icon = item.icon

        return (
          <Link
            key={item.key}
            href={href}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'label-md relative flex h-[40px] items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
              'text-muted-foreground hover:opacity-80',
              isActive && 'bg-primary-50 text-primary-400 font-medium'
            )}
          >
            {isActive && (
              <span className="bg-primary-400 absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r" />
            )}

            <span className="shrink-0">
              <Icon size={16} />
            </span>

            {!isCollapsed && (
              <>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge != null && (
                  <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
