// src/features/schedule/week/hooks/useWeeklyActuals.ts

import { useQuery } from '@tanstack/react-query'
import { WeeklyActualsParams, WeeklyActualsResponse } from '../types'

async function fetchWeeklyActuals(params: WeeklyActualsParams): Promise<WeeklyActualsResponse> {
  const searchParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  })
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  const res = await fetch(`/api/task-actuals/weekly?${searchParams}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '주간 실제 일정 조회 실패')
  return json.data
}

export const WEEKLY_ACTUALS_QUERY_KEYS = {
  all: ['weeklyActuals'] as const,
  params: (params: WeeklyActualsParams) => ['weeklyActuals', params] as const,
}

export function useWeeklyActuals(params: WeeklyActualsParams) {
  return useQuery({
    queryKey: WEEKLY_ACTUALS_QUERY_KEYS.params(params),
    queryFn: () => fetchWeeklyActuals(params),
  })
}
