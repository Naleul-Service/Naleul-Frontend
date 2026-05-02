import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateActualTaskBody } from '../api/day'
import { invalidateScheduleAll } from '@/src/lib/queryInvalidations'

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
      invalidateScheduleAll(queryClient)
    },
  })
}
