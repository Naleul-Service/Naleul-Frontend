export const SCHEDULE_TABS = [
  { label: '일간', href: '/schedule/day' },
  { label: '주간', href: '/schedule/week' },
  { label: '월간', href: '/schedule/month' },
] as const

export type ScheduleTab = (typeof SCHEDULE_TABS)[number]
