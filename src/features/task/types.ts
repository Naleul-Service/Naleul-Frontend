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

// 기존 TaskActual은 Task 안에 내장된 용도 — 유지
export interface TaskActual {
  taskActualId: number
  actualStartAt: string
  actualEndAt: string
  actualDurationMinutes: number
}

// 독립 TaskActual 엔티티 (새 API 응답)
export interface TaskActualItem {
  taskActualId: number
  taskId: number | null
  taskName: string
  goalCategoryId: number
  goalCategoryName: string
  goalCategoryColorCode: string | null
  generalCategoryId: number
  generalCategoryName: string
  generalCategoryColorCode: string | null
  actualStartAt: string
  actualEndAt: string
  actualDurationMinutes: number
}

export interface CreateTaskActualBody {
  taskId?: number | null
  taskName: string
  goalCategoryId: number
  generalCategoryId: number
  actualStartAt: string
  actualEndAt: string
}

export interface TaskActualUpdateBody {
  taskName: string
  goalCategoryId: number
  generalCategoryId: number
  actualStartAt: string
  actualEndAt: string
}
