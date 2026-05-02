import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateScheduleAll } from '@/src/lib/queryInvalidations'

async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '할 일 삭제 실패')
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      invalidateScheduleAll(queryClient)
    },
  })
}
