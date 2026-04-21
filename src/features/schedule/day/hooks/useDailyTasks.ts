import { useQuery } from '@tanstack/react-query'
import { DailyTasksParams, DailyTasksResponse } from '../types'

export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  daily: (params: DailyTasksParams) => ['tasks', 'daily', params] as const,
}

async function fetchDailyTasks(params: DailyTasksParams): Promise<DailyTasksResponse> {
  const searchParams = new URLSearchParams({ date: params.date, dayOfWeek: params.dayOfWeek })

  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  const res = await fetch(`/api/tasks/daily?${searchParams}`)

  // res.ok 체크 — json.success만 보면 네트워크 에러 누락됨
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '일간 할 일 조회 실패')
  return json.data
}

export function useDailyTasks(params: DailyTasksParams) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.daily(params),
    queryFn: () => fetchDailyTasks(params),
    staleTime: 1000 * 30,
  })
}
