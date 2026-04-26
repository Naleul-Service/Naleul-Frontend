'use client'

import { CategoryIcon, GoalIcon, HomeIcon, RetrospectIcon, SidebarScheduleIcon } from '@/src/assets/svgComponents'
import { NavItem } from './types'

const getTodayDateParam = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // 'YYYY-MM-DD'
}

export const ROLE_LABEL: Record<string, string> = {
  FREE: '무료',
  PRO: 'PRO',
  ADMIN: '관리자',
}

export const NAV_ITEMS: NavItem[] = [
  {
    key: 'home',
    label: '홈',
    href: '/',
    selectedIcon: <HomeIcon width={32} height={32} />,
    unselectedIcon: <HomeIcon width={32} height={32} />,
  },
  {
    key: 'category',
    label: '목표 관리',
    href: '/category',
    selectedIcon: <CategoryIcon width={32} height={32} />,
    unselectedIcon: <CategoryIcon width={32} height={32} />,
    getHref: () => `/category`,
  },
  {
    key: 'schedule',
    label: '일정관리',
    href: '/schedule',
    selectedIcon: <SidebarScheduleIcon width={32} height={32} />,
    unselectedIcon: <SidebarScheduleIcon width={32} height={32} />,
    getHref: () => `/schedule?date=${getTodayDateParam()}`,
  },
  {
    key: 'goal',
    label: '목표달성',
    href: '/goal',
    selectedIcon: <GoalIcon width={32} height={32} />,
    unselectedIcon: <GoalIcon width={32} height={32} />,
  },
  {
    key: 'retrospect',
    label: '회고',
    href: '/retrospect',
    selectedIcon: <RetrospectIcon width={32} height={32} />,
    unselectedIcon: <RetrospectIcon width={32} height={32} />,
  },
]
