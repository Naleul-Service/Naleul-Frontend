import { INITIAL_FILTER, TaskFilterState, TaskPriority } from '@/src/features/task/types'

export type { TaskFilterState }
export { INITIAL_FILTER }

export interface DailyTasksParams {
  date: string
  priority?: TaskPriority
  goalCategoryId?: number
  generalCategoryId?: number
}

export interface Task {
  taskId: number
  taskName: string
  taskPriority: TaskPriority
  goalCategoryId: number | null
  goalCategoryName: string | null
  goalCategoryColorCode: string | null
  generalCategoryId: number | null
  generalCategoryName: string | null
  generalCategoryColorCode: string | null
  plannedStartAt: string
  plannedEndAt: string
  plannedDurationMinutes: number
  actual: TaskActual | null
  defaultSettingStatus: boolean
}

export interface TaskActual {
  taskActualId: number
  actualStartAt: string
  actualEndAt: string
  actualDurationMinutes: number
}
