export const TASK_PRIORITIES = ['A', 'B', 'C', 'D', 'E'] as const
export type TaskPriority = (typeof TASK_PRIORITIES)[number]

export const DAY_OF_WEEK_OPTIONS = [
  { id: 1, label: '월', name: 'MONDAY' },
  { id: 2, label: '화', name: 'TUESDAY' },
  { id: 3, label: '수', name: 'WEDNESDAY' },
  { id: 4, label: '목', name: 'THURSDAY' },
  { id: 5, label: '금', name: 'FRIDAY' },
  { id: 6, label: '토', name: 'SATURDAY' },
  { id: 7, label: '일', name: 'SUNDAY' },
] as const

export interface CreateTaskBody {
  taskName: string
  taskPriority: TaskPriority
  goalCategoryId?: number
  generalCategoryId?: number
  plannedStartAt: string
  plannedEndAt: string
  dayOfWeekIds: number[]
  defaultSettingStatus: boolean
}

export interface UpdateTaskBody {
  taskName: string
  taskPriority: 'A' | 'B' | 'C' | 'D' | 'E'
  goalCategoryId?: number
  generalCategoryId?: number
  plannedStartAt: string
  plannedEndAt: string
  dayOfWeekIds?: number[]
  defaultSettingStatus?: boolean
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
