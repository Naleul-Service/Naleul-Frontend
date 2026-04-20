'use client'

import { usePathname } from 'next/navigation'
import { ScheduleTabBar } from './ScheduleTabBar'

export function ScheduleTabBarContainer() {
  const pathname = usePathname()
  return <ScheduleTabBar currentPath={pathname} />
}
