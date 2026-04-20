'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'

export function SidebarToggle() {
  const { isCollapsed, toggle } = useSidebarStore()

  return (
    <button
      onClick={toggle}
      aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      className="border-border hover:bg-muted rounded-md border p-1.5 transition-colors"
    >
      {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
    </button>
  )
}
