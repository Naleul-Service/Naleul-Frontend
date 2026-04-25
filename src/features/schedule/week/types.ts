import { Task, TaskActualItem } from '@/src/features/schedule/day/types'
import { TaskPriority } from '@/src/features/task/types'

export interface WeeklyTasksParams {
  startDate: string
  endDate: string
  priority?: TaskPriority
  goalCategoryId?: number
  generalCategoryId?: number
  dayOfWeek?: string
}

export interface WeeklyTasksResponse {
  tasksByDay: Record<string, Task[]>
}

export interface WeeklyActualsResponse {
  actualsByDay: Record<string, TaskActualItem[]>
}

export interface WeeklyActualsParams {
  startDate: string
  endDate: string
  goalCategoryId?: number
  generalCategoryId?: number
}
