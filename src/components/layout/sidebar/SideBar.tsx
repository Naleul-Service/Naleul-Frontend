'use client'

import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { SidebarFooter } from './SidebarFooter'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { cn } from '@/src/lib/utils'
import { Logo, ShortLogo } from '@/src/assets/svgComponents'

export function Sidebar() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  return (
    <aside
      className={cn(
        'sticky top-0 z-40 flex h-screen flex-col border-r border-gray-100',
        'transition-all duration-200 ease-in-out',
        isCollapsed ? 'w-[60px]' : 'w-[200px]'
      )}
    >
      <div className="group relative flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-3.5">
        {isCollapsed ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <div className="transition-opacity duration-200 group-hover:opacity-0">
              <ShortLogo width={31} height={21} />
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <SidebarToggle />
            </div>
          </div>
        ) : (
          <>
            <Logo width={88} height={24} />
            <SidebarToggle />
          </>
        )}
      </div>

      <SidebarNav />
      <SidebarFooter />
    </aside>
  )
}
