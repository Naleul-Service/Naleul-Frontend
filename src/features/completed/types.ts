export interface CompletedGoalCategory {
  goalCategoryId: number
  goalCategoryName: string
  achievement: string
  totalActualMinutes: number
  durationDays: number
  taskCount: number
}

export interface CompletedGoalCategoryPage {
  content: CompletedGoalCategory[]
  totalElements: number
  totalPages: number
  number: number
  first: boolean
  last: boolean
  size: number
}
