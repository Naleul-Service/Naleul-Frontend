'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from './constants'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { cn } from '@/src/lib/utils'

// SidebarNav.tsx
export function SidebarNav() {
  const pathname = usePathname()
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  return (
    <nav
      className={cn(
        'flex-1 space-y-1 gap-y-1 overflow-y-auto p-2',
        isCollapsed && 'flex flex-col items-center' // 접혔을 때 아이콘들을 세로 중앙 정렬
      )}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        const href = item.getHref?.() ?? item.href

        return (
          <Link
            key={item.key}
            href={href}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'relative flex h-10 items-center rounded-md transition-colors',
              'text-muted-foreground hover:opacity-80',
              // 1. 너비 조절: 접혔을 때는 고정 너비(정사각형), 펼쳐졌을 때는 전체 너비
              isCollapsed ? 'w-10 justify-center' : 'w-full gap-x-3 px-3',
              isActive && 'bg-primary-50 text-primary-400 font-medium'
            )}
          >
            {/* 2. 아이콘 영역: 고정 크기를 주고 내부에서 정중앙 정렬 */}
            <span className="flex h-[32px] w-[32px] shrink-0 items-center justify-center">{item.selectedIcon}</span>

            {/* 3. 텍스트 영역 */}
            {!isCollapsed && (
              <div className="flex flex-1 items-center justify-between overflow-hidden">
                <span className="label-md truncate">{item.label}</span>
                {item.badge != null && (
                  <span className="ml-2 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium text-red-600">
                    {item.badge}
                  </span>
                )}
              </div>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
