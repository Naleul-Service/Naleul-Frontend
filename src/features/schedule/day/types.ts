import { INITIAL_FILTER, TaskFilterState, TaskPriority } from '@/src/features/task/types'

export type { TaskFilterState }
export { INITIAL_FILTER }

export interface DailyTasksParams {
  date: string
  priority?: TaskPriority
  goalCategoryId?: number
  generalCategoryId?: number
}

export interface DailyActualsParams {
  date: string
  goalCategoryId?: number
  generalCategoryId?: number
}
