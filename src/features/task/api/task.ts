import { apiCallServer } from '@/src/lib/api.server'
import { ApiCallResult } from '@/src/types/common'
import { CreateTaskBody } from '@/src/features/task/types'

export async function createTask(body: CreateTaskBody): Promise<ApiCallResult<void>> {
  return apiCallServer('/v1/tasks', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
