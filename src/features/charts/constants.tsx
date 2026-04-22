import { ValueType } from 'recharts/types/component/DefaultTooltipContent'

export const CHART_QUERY_KEYS = {
  all: ['charts'] as const,
  goalCategories: () => [...CHART_QUERY_KEYS.all, 'goal-categories'] as const,
  goalCategoriesDetail: () => [...CHART_QUERY_KEYS.all, 'goal-categories-detail'] as const,
  generalCategories: () => [...CHART_QUERY_KEYS.all, 'general-categories'] as const,
  achievement: () => [...CHART_QUERY_KEYS.all, 'achievement'] as const,
}

export const FALLBACK_COLOR = '#E5E7EB'

// 분 → "Xh Ym" 포맷
export const formatMinutes = (minutes: ValueType | undefined): string => {
  const mins = Math.round(Math.abs(Number(Array.isArray(minutes) ? minutes[0] : (minutes ?? 0))))
  if (mins === 0) return '0m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}
