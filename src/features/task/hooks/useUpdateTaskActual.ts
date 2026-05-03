import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskActualUpdateBody } from '../types'

async function updateTaskActual(taskActualId: number, body: TaskActualUpdateBody) {
  const res = await fetch(`/api/task-actuals/${taskActualId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '수정 실패')
  return json.data
}

export function useUpdateTaskActual() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskActualId, body }: { taskActualId: number; body: TaskActualUpdateBody }) =>
      updateTaskActual(taskActualId, body),
    // onSuccess: () => {
    //   invalidateScheduleAll(queryClient)
    // },
  })
}
