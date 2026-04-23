import { DailyTasksParams, Task } from '@/src/features/schedule/day/types'
import { ApiCallResult } from '@/src/types/common'
import { apiCallServer } from '@/src/lib/api.server'

export async function getDailyTasks(params: DailyTasksParams): Promise<ApiCallResult<Task[]>> {
  const searchParams = new URLSearchParams({
    date: params.date,
  })

  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  return apiCallServer(`/v1/tasks/daily?${searchParams}`)
}

export interface UpdateActualTaskBody {
  actualStartAt: string
  actualEndAt: string
}

export async function patchActualTask(taskId: number, body: UpdateActualTaskBody): Promise<ApiCallResult<void>> {
  return apiCallServer(`/v1/tasks/${taskId}/actual`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
