import { INITIAL_FILTER, TaskFilterState, TaskPriority } from '@/src/features/task/types'

export type { TaskFilterState, INITIAL_FILTER }

export interface DailyTasksParams {
  date: string
  dayOfWeek: string
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
  actuals: TaskActual[]
  defaultSettingStatus: boolean
  dayNames: string[]
}

export interface TaskActual {
  taskActualId: number
  actualDate: string
  actualStartAt: string
  actualEndAt: string
  actualDurationMinutes: number
}

export interface DailyTasksResponse {
  tasks: Task[]
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}
