'use client'

import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { SidebarFooter } from './SidebarFooter'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { cn } from '@/src/lib/utils'

export function Sidebar() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  return (
    <aside
      className={cn(
        'border-border bg-background sticky top-0 flex h-screen flex-col border-r',
        'transition-all duration-200 ease-in-out',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* 헤더 */}
      <div className="border-border flex h-14 shrink-0 items-center justify-between border-b px-3.5">
        {!isCollapsed && <span className="text-foreground text-sm font-medium">워크스페이스</span>}
        <div className={cn(isCollapsed && 'mx-auto')}>
          <SidebarToggle />
        </div>
      </div>

      <SidebarNav />
      <SidebarFooter />
    </aside>
  )
}
