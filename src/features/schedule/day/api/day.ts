import { ApiCallResult } from '@/src/types/common'
import { apiCallServer } from '@/src/lib/api.server'
import { DailyTasksParams, DailyTasksResponse } from '@/src/features/schedule/day/types'

export async function getDailyTasks(params: DailyTasksParams): Promise<ApiCallResult<DailyTasksResponse>> {
  const searchParams = new URLSearchParams({
    date: params.date,
    dayOfWeek: params.dayOfWeek,
  })
  return apiCallServer(`/v1/tasks/daily?${searchParams.toString()}`)
}
