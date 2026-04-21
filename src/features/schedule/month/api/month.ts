import { apiCallServer } from '@/src/lib/api.server'
import { ApiCallResult } from '@/src/types/common'
import { MonthlyTasksParams, MonthlyTasksResponse } from '../types'

export async function getMonthlyTasks(params: MonthlyTasksParams): Promise<ApiCallResult<MonthlyTasksResponse>> {
  const searchParams = new URLSearchParams({
    year: String(params.year),
    month: String(params.month),
  })

  return apiCallServer(`/v1/tasks/monthly?${searchParams}`)
}
