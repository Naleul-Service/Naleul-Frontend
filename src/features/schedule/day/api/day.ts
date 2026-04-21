import { DailyTasksParams, DailyTasksResponse } from '@/src/features/schedule/day/types'
import { ApiCallResult } from '@/src/types/common'
import { apiCallServer } from '@/src/lib/api.server'

export async function getDailyTasks(params: DailyTasksParams): Promise<ApiCallResult<DailyTasksResponse>> {
  const searchParams = new URLSearchParams({
    date: params.date,
    dayOfWeek: params.dayOfWeek,
  })

  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  return apiCallServer(`/v1/tasks/daily?${searchParams}`)
}
