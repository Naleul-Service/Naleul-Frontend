export const TASK_PRIORITIES = ['A', 'B', 'C', 'D', 'E'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

// DAY_OF_WEEK_OPTIONS 전체 제거

export interface CreateTaskBody {
  taskName: string
  taskPriority: TaskPriority
  goalCategoryId: number
  generalCategoryId: number
  plannedStartAt: string
  plannedEndAt: string
  defaultSettingStatus: boolean
}

export interface UpdateTaskBody {
  taskName: string
  taskPriority: TaskPriority
  goalCategoryId: number
  generalCategoryId: number
  plannedStartAt: string
  plannedEndAt: string
  defaultSettingStatus: boolean
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
