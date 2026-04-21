import { apiCallServer } from '@/src/lib/api.server'
import { ApiCallResult } from '@/src/types/common'
import { CreateTaskBody, UpdateTaskBody } from '@/src/features/task/types'

export async function createTask(body: CreateTaskBody): Promise<ApiCallResult<void>> {
  return apiCallServer('/v1/tasks', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateTask(taskId: number, body: UpdateTaskBody): Promise<ApiCallResult<void>> {
  return apiCallServer(`/v1/tasks/${taskId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteTask(taskId: number): Promise<ApiCallResult<void>> {
  return apiCallServer(`/v1/tasks/${taskId}`, {
    method: 'DELETE',
  })
}
