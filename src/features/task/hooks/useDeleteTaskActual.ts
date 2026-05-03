import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateScheduleAll } from '@/src/lib/queryInvalidations'

async function deleteTaskActual(taskActualId: number) {
  const res = await fetch(`/api/task-actuals/${taskActualId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '삭제 실패')
}

export function useDeleteTaskActual(date: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTaskActual,
    onSuccess: () => {
      invalidateScheduleAll(queryClient)
    },
  })
}
