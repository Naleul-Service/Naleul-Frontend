import { apiCallServer } from '@/src/lib/api.server'

export type GoalCategoryStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'

export interface GeneralCategoryItemType {
  generalCategoryId: number
  generalCategoryName: string
  colorCode: string
}

export interface GoalCategory {
  goalCategoryId: number
  goalCategoryName: string
  goalCategoryStatus: GoalCategoryStatus
  goalCategoryStartDate: string
  goalCategoryEndDate: string
  achievement: string
  colorCode: string // colorId 대신 colorCode 직접 내려옴
  generalCategories: GeneralCategoryItemType[]
}

export interface CreateGoalCategoryRequest {
  colorId: number
  goalCategoryName: string
  goalCategoryStatus: GoalCategoryStatus
  goalCategoryStartDate: string
}

export async function getGoalCategories(): Promise<GoalCategory[]> {
  const result = await apiCallServer<GoalCategory[]>('/v1/goal-categories')
  if (!result.success) throw new Error(result.error ?? '목표 카테고리 조회 실패')
  return result.data ?? []
}

export async function createGoalCategory(body: CreateGoalCategoryRequest): Promise<GoalCategory> {
  const result = await apiCallServer<GoalCategory>('/v1/goal-categories', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '목표 카테고리 생성 실패')
  return result.data!
}

export async function updateGeneralCategories(goalCategoryId: number, generalCategoryIds: number[]): Promise<void> {
  const result = await apiCallServer(`/v1/goal-categories/${goalCategoryId}/general-categories`, {
    method: 'PATCH',
    body: JSON.stringify({ generalCategoryIds }),
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 수정 실패')
}
