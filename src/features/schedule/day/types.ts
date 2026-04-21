import { TaskPriority } from '@/src/features/task/types'

export interface DailyTasksParams {
  date: string
  dayOfWeek: string
  priority?: TaskPriority
  goalCategoryId?: number
  generalCategoryId?: number
}

export interface TaskFilterState {
  priority: TaskPriority | null
  goalCategoryId: number | null
  generalCategoryId: number | null
}

export const INITIAL_FILTER: TaskFilterState = {
  priority: null,
  goalCategoryId: null,
  generalCategoryId: null,
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
  actualStartAt: string | null
  actualEndAt: string | null
  actualDurationMinutes: number | null
  defaultSettingStatus: boolean
  dayNames: string[]
}

export interface DailyTasksResponse {
  tasks: Task[]
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}
