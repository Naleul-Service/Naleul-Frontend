import { useQuery } from '@tanstack/react-query'
import { WeeklyTasksParams, WeeklyTasksResponse } from '../types'

async function fetchWeeklyTasks(params: WeeklyTasksParams): Promise<WeeklyTasksResponse> {
  const searchParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  })

  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))
  if (params.dayOfWeek) searchParams.set('dayOfWeek', params.dayOfWeek)

  const res = await fetch(`/api/tasks/weekly?${searchParams}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '주간 할 일 조회 실패')
  return json.data
}

export const WEEKLY_TASK_QUERY_KEYS = {
  all: ['weeklyTasks'] as const,
  params: (params: WeeklyTasksParams) => ['weeklyTasks', params] as const,
}

export function useWeeklyTasks(params: WeeklyTasksParams) {
  return useQuery({
    queryKey: WEEKLY_TASK_QUERY_KEYS.params(params),
    queryFn: () => fetchWeeklyTasks(params),
  })
}
