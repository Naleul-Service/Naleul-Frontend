import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateTaskBody } from '@/src/features/task/types'
import { TASK_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { WEEKLY_TASK_QUERY_KEYS } from '@/src/features/schedule/week/hooks/useWeeklyTasks' // 키 한 곳에서 관리

async function fetchCreateTask(body: CreateTaskBody): Promise<void> {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '할 일 생성 실패')
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchCreateTask,
    onSuccess: () => {
      // daily 전체 무효화 (날짜 무관하게 모두 리패치)
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: WEEKLY_TASK_QUERY_KEYS.all })
    },
  })
}
