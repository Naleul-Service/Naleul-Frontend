'use client'

import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { Button } from '@/src/components/common/Button'
import { ChevronLeft, ChevronRight } from '@/src/assets/svgComponents'

export function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <Button
      variant={'outline'}
      size={'iconSm'}
      onClick={toggle}
      aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors"
    >
      {isCollapsed ? (
        <ChevronRight width={20} height={20} className="text-gray-300" />
      ) : (
        <ChevronLeft width={20} height={20} className="text-gray-300" />
      )}
    </Button>
  )
}
