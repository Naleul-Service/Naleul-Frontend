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
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.key}
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
              'text-muted-foreground hover:bg-muted hover:text-foreground',
              isActive && 'bg-muted text-foreground font-medium'
            )}
          >
            {/* active indicator */}
            {isActive && <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-r bg-blue-500" />}

            <span className="shrink-0">{item.icon}</span>

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
