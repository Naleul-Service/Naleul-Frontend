'use client'

import { NavItem } from './types'
import { CalendarDays, Home, NotebookPen, Trophy } from 'lucide-react'

const getTodayDateParam = () => {
  const today = new Date()
  return today.toISOString().split('T')[0] // 'YYYY-MM-DD'
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', href: '/', icon: Home },
  {
    key: 'schedule',
    label: '일정관리',
    href: '/schedule',
    icon: CalendarDays,
    getHref: () => `/schedule?date=${getTodayDateParam()}`,
  },
  { key: 'goal', label: '목표달성', href: '/goal', icon: Trophy },
  { key: 'retrospect', label: '회고', href: '/retrospect', icon: NotebookPen },
]
