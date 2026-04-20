// features/category/api/generalCategory.ts

import { apiCallServer } from '@/src/lib/api.server'

export interface GeneralCategory {
  generalCategoryId: number
  generalCategoryName: string
  goalCategoryId: number
  colorId: number
}

export interface CreateGeneralCategoryRequest {
  generalCategoryName: string
  goalCategoryId: number
  colorId: number
}

export interface UpdateGeneralCategoryRequest {
  generalCategoryName: string
  goalCategoryId: number
  colorId: number
}

export async function createGeneralCategory(body: CreateGeneralCategoryRequest): Promise<GeneralCategory> {
  const result = await apiCallServer<GeneralCategory>('/v1/general-categories', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 생성 실패')
  return result.data!
}

// PUT /api/v1/general-categories/{id}
export async function updateGeneralCategory(
  generalCategoryId: number,
  body: UpdateGeneralCategoryRequest
): Promise<void> {
  const result = await apiCallServer(`/v1/general-categories/${generalCategoryId}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 수정 실패')
}

// DELETE /api/v1/general-categories/{id}
export async function deleteGeneralCategory(generalCategoryId: number): Promise<void> {
  const result = await apiCallServer(`/v1/general-categories/${generalCategoryId}`, {
    method: 'DELETE',
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 삭제 실패')
}
