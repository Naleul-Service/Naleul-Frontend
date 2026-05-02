import { QueryClient } from '@tanstack/react-query'
import { TASK_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { TASK_ACTUAL_QUERY_KEYS } from '@/src/features/schedule/day/hooks/useDailyActuals'
import { WEEKLY_TASK_QUERY_KEYS } from '@/src/features/schedule/week/hooks/useWeeklyTasks'
import { WEEKLY_ACTUALS_QUERY_KEYS } from '@/src/features/schedule/week/hooks/useWeeklyActuals'

export function invalidateTaskRelated(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.all })
  queryClient.invalidateQueries({ queryKey: WEEKLY_TASK_QUERY_KEYS.all })
}

export function invalidateActualRelated(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: TASK_ACTUAL_QUERY_KEYS.all })
  queryClient.invalidateQueries({ queryKey: WEEKLY_ACTUALS_QUERY_KEYS.all })
}

export function invalidateScheduleAll(queryClient: QueryClient) {
  invalidateTaskRelated(queryClient)
  invalidateActualRelated(queryClient)
}
