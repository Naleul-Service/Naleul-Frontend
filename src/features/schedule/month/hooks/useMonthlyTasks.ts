import { useQuery } from '@tanstack/react-query'
import { MonthlyTasksParams, MonthlyTasksResponse } from '../types'

async function fetchMonthlyTasks(params: MonthlyTasksParams): Promise<MonthlyTasksResponse> {
  const searchParams = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  })

  const res = await fetch(`/api/tasks/monthly?${searchParams}`)
  const json = await res.json()

  if (!json.success) throw new Error(json.error ?? '월간 할 일 조회 실패')
  return json.data.tasksByDate
}

export const MONTHLY_TASK_QUERY_KEYS = {
  all: ['monthlyTasks'] as const,
  params: (params: MonthlyTasksParams) => ['monthlyTasks', params] as const,
}

export function useMonthlyTasks(params: MonthlyTasksParams) {
  return useQuery({
    queryKey: MONTHLY_TASK_QUERY_KEYS.params(params),
    queryFn: () => fetchMonthlyTasks(params),
  })
}
