import { Task } from '@/src/features/schedule/day/types'
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
