import { apiCallServer } from '@/src/lib/api.server'
import { ApiCallResult } from '@/src/types/common'
import { WeeklyTasksParams, WeeklyTasksResponse } from '../types'

export async function getWeeklyTasks(params: WeeklyTasksParams): Promise<ApiCallResult<WeeklyTasksResponse>> {
  const searchParams = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  })

  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))
  if (params.dayOfWeek) searchParams.set('dayOfWeek', params.dayOfWeek)

  return apiCallServer(`/v1/tasks/weekly?${searchParams}`)
}
