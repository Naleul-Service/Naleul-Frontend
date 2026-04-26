const getTodayDateParam = () => new Date().toISOString().split('T')[0]

export const SCHEDULE_TABS = [
  {
    label: '일간',
    href: '/schedule',
    pathname: '/schedule',
    getHref: () => `/schedule?date=${getTodayDateParam()}`,
  },
  {
    label: '주간',
    href: '/schedule/week',
    pathname: '/schedule/week',
    getHref: () => `/schedule/week?date=${getTodayDateParam()}`, // ✅ 추가
  },
  {
    label: '월간',
    href: '/schedule/month',
    pathname: '/schedule/month',
    getHref: () => `/schedule/month?date=${getTodayDateParam()}`, // ✅ 추가
  },
] as const
