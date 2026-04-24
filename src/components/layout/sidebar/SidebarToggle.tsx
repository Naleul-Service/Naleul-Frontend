'use client'

import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { SidebarCloseIcon, SidebarOpenIcon } from '@/src/assets/svgComponents'

export function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <button onClick={toggle} aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}>
      {isCollapsed ? (
        <SidebarOpenIcon width={20} height={20} className="text-gray-300" />
      ) : (
        <SidebarCloseIcon width={20} height={20} className="text-gray-300" />
      )}
    </button>
  )
}
