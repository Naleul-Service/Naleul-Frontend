// src/features/task/hooks/useUpdateTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateTaskBody } from '@/src/features/task/types'
import { TASK_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { WEEKLY_TASK_QUERY_KEYS } from '@/src/features/schedule/week/hooks/useWeeklyTasks'

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
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: WEEKLY_TASK_QUERY_KEYS.all })
    },
  })
}
