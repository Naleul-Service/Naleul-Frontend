import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateActualTaskBody } from '@/src/features/task/api/task'
import { TASK_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { TASK_ACTUAL_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyActuals'

async function updateActualTask(taskId: number, body: UpdateActualTaskBody): Promise<void> {
  const res = await fetch(`/api/task-actuals/${taskId}/actual`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '실제 시간 저장 실패')
}

export function useUpdateActualTask(date?: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, body }: { taskId: number; body: UpdateActualTaskBody }) => updateActualTask(taskId, body),
    onSuccess: () => {
      // Task 목록 갱신 (완료 탭 반영)
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
      // TaskActual 목록 갱신 (TimeTable 반영)
      if (date) {
        queryClient.invalidateQueries({ queryKey: TASK_ACTUAL_QUERY_KEYS.daily({ date }) })
      }
    },
  })
}
