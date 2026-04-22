const getTodayDateParam = () => new Date().toISOString().split('T')[0]

export const SCHEDULE_TABS = [
  {
    label: '일간',
    href: '/schedule',
    pathname: '/schedule',
    getHref: () => `/schedule?date=${getTodayDateParam()}`,
  },
  { label: '주간', href: '/schedule/week', pathname: '/schedule/week' },
  { label: '월간', href: '/schedule/month', pathname: '/schedule/month' },
] as const
