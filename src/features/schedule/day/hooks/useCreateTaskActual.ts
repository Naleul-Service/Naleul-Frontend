import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateTaskActualBody, TaskActualItem } from '../types'
import { TASK_ACTUAL_QUERY_KEYS } from './useDailyActuals'

async function createTaskActual(body: CreateTaskActualBody): Promise<TaskActualItem> {
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

export function useCreateTaskActual(date: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTaskActual,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TASK_ACTUAL_QUERY_KEYS.daily({ date }),
      })
    },
  })
}
