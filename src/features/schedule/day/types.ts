import { TaskPriority } from '@/src/features/task/types'

export interface Task {
  taskId: number
  taskName: string
  taskPriority: TaskPriority
  goalCategoryId: number | null
  goalCategoryName: string | null
  generalCategoryId: number | null
  generalCategoryName: string | null
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

export interface DailyTasksParams {
  date: string // 'yyyy-MM-dd'
  dayOfWeek: string // 'MONDAY' 등
}
