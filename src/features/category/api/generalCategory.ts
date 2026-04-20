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

export async function createGeneralCategory(body: CreateGeneralCategoryRequest): Promise<GeneralCategory> {
  const result = await apiCallServer<GeneralCategory>('/v1/general-categories', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '일반 카테고리 생성 실패')
  return result.data!
}
