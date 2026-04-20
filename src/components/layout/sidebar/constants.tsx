'use client'

import { NavItem } from './types'
import { CalendarDays, Home, NotebookPen, Trophy } from 'lucide-react'

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', label: '홈', href: '/', icon: <Home size={16} /> },
  { key: 'schedule', label: '일정관리', href: '/schedule/day', icon: <CalendarDays size={16} /> },
  { key: 'goal', label: '목표달성', href: '/goal', icon: <Trophy size={16} /> },
  { key: 'retrospect', label: '회고', href: '/retrospect', icon: <NotebookPen size={16} /> },
]
