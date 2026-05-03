import { DailyActualsParams, DailyTasksParams } from '@/src/features/schedule/day/types'
import { ApiCallResult } from '@/src/types/common'
import { apiCallServer } from '@/src/lib/api.server'
import { Task, TaskActualItem } from '@/src/features/task/types'

export async function getDailyTasks(params: DailyTasksParams): Promise<ApiCallResult<Task[]>> {
  const searchParams = new URLSearchParams({ date: params.date })
  if (params.priority) searchParams.set('priority', params.priority)
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))
  return apiCallServer(`/v1/tasks/daily?${searchParams}`)
}

// getDailyActuals — client fetch (Route Handler 경유)
export async function getDailyActuals(params: DailyActualsParams): Promise<TaskActualItem[]> {
  const searchParams = new URLSearchParams({ date: params.date })
  if (params.goalCategoryId != null) searchParams.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) searchParams.set('generalCategoryId', String(params.generalCategoryId))

  const res = await fetch(`/api/task-actuals/daily?${searchParams}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '실제 시간 조회 실패')
  return json.data
}
