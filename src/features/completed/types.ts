import { GeneralCategoryType } from '@/src/features/category/types'

export interface CompletedGoalCategory {
  goalCategoryId: number
  goalCategoryName: string
  achievement: string
  totalActualMinutes: number
  durationDays: number
  taskCount: number
  colorCode: string
  startDate: string
  endDate: string
  generalCategories: GeneralCategoryType[]
}

export interface CompletedGoalCategoryPage {
  totalCompletedCount: number
  totalActualMinutes: number
  averageDurationDays: number
  content: CompletedGoalCategory[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}
