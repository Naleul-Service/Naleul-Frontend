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

export interface UpdateGoalCategoryRequest {
  colorId: number
  goalCategoryName: string
  goalCategoryStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  goalCategoryStartDate: string
}

export interface CompleteGoalCategoryRequest {
  goalCategoryEndDate: string
  achievement: string
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

// DELETE /api/category/goal-categories/{goalCategoryId}
export async function deleteGoalCategory(goalCategoryId: number): Promise<void> {
  const result = await apiCallServer(`/v1/goal-categories/${goalCategoryId}`, {
    method: 'DELETE',
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 삭제 실패')
}

// PATCH /api/category/goal-categories/{goalCategoryId}
export async function updateGoalCategory(goalCategoryId: number, body: UpdateGoalCategoryRequest): Promise<void> {
  const result = await apiCallServer(`/v1/goal-categories/${goalCategoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '목표 카테고리 수정 실패')
  return result.data!
}

// PATCH /api/category/goal-categories/{goalCategoryId}/complete
export async function completeGoalCategory(goalCategoryId: number, body: CompleteGoalCategoryRequest): Promise<void> {
  const result = await apiCallServer(`/v1/goal-categories/${goalCategoryId}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '목표 카테고리 완료 수정 실패')
  return result.data!
}
