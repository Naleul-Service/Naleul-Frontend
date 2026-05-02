// src/features/task/hooks/useUpdateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateTaskBody } from '@/src/features/task/types'
import { invalidateScheduleAll } from '@/src/lib/queryInvalidations'

async function updateTask(taskId: number, body: UpdateTaskBody): Promise<void> {
  const res = await fetch(`/api/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '할 일 수정 실패')
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, body }: { taskId: number; body: UpdateTaskBody }) => updateTask(taskId, body),
    onSuccess: () => {
      invalidateScheduleAll(queryClient)
    },
  })
}
