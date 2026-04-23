import { useQuery } from '@tanstack/react-query'
import { DailyActualsParams, TaskActualItem } from '../types'

export const TASK_ACTUAL_QUERY_KEYS = {
  daily: (params: DailyActualsParams) => ['task-actuals', 'daily', params] as const,
}

async function fetchDailyActuals(params: DailyActualsParams): Promise<TaskActualItem[]> {
  const searchParams = new URLSearchParams({ date: params.date })
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  const res = await fetch(`/api/task-actuals/daily?${searchParams}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '실제 시간 조회 실패')
  return json.data
}

export function useDailyActuals(params: DailyActualsParams) {
  return useQuery({
    queryKey: TASK_ACTUAL_QUERY_KEYS.daily(params),
    queryFn: () => fetchDailyActuals(params),
    staleTime: 1000 * 30,
  })
}
