import { apiCallServer } from '@/src/lib/api.server'
import { ApiCallResult } from '@/src/types/common'
import {
  CreateTaskActualBody,
  CreateTaskBody,
  TaskActualItem,
  TaskActualUpdateBody,
  UpdateTaskBody,
} from '@/src/features/task/types'

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

export async function postTaskActual(body: CreateTaskActualBody): Promise<TaskActualItem> {
  const res = await fetch('/api/task-actuals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '실제 시간 기록 실패')
  return json.data
}

export interface UpdateActualTaskBody {
  actualStartAt: string
  actualEndAt: string
}

export async function patchActualTask(taskId: number, body: UpdateActualTaskBody): Promise<ApiCallResult<void>> {
  return apiCallServer(`/v1/task-actuals/${taskId}/actual`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function patchTaskActual(
  taskActualId: number,
  body: TaskActualUpdateBody
): Promise<ApiCallResult<TaskActualItem>> {
  return apiCallServer(`/v1/task-actuals/${taskActualId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function deleteTaskActual(taskActualId: number): Promise<ApiCallResult<void>> {
  return apiCallServer(`/v1/task-actuals/${taskActualId}`, {
    method: 'DELETE',
  })
}
