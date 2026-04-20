import { useQuery } from '@tanstack/react-query'
import { DailyTasksParams, DailyTasksResponse } from '@/src/features/schedule/day/types'

// 쿼리 키 — useCreateTask의 TASK_QUERY_KEYS.all과 계층 공유
export const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  daily: (params: DailyTasksParams) => ['tasks', 'daily', params] as const,
}

async function fetchDailyTasks(params: DailyTasksParams): Promise<DailyTasksResponse> {
  const searchParams = new URLSearchParams({
    date: params.date,
    dayOfWeek: params.dayOfWeek,
  })

  const res = await fetch(`/api/tasks/daily?${searchParams.toString()}`)
  const json = await res.json()

  if (!json.success) throw new Error(json.error ?? '일간 할 일 조회 실패')
  return json.data
}

export function useDailyTasks(params: DailyTasksParams) {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.daily(params),
    queryFn: () => fetchDailyTasks(params),
    staleTime: 1000 * 30, // 30초
  })
}
