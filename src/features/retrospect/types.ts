// features/retrospective/types.ts

import type { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'

export type ReviewType = 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface RetrospectiveResponse {
  retrospectiveId: number
  reviewType: ReviewType
  reviewDate: string
  content: string
  goalCategoryId: number | null
  goalCategoryName: string | null
  goalCategoryColorCode: string | null
  generalCategoryId: number | null
  generalCategoryName: string | null
  generalCategoryColorCode: string | null
}

export interface RetrospectiveCreateRequest {
  reviewType: ReviewType
  reviewDate?: string
  content: string
  goalCategoryId?: number | null
  generalCategoryId?: number | null
}

export interface RetrospectiveUpdateRequest {
  content: string
  goalCategoryId?: number | null
  generalCategoryId?: number | null
}

export interface RetrospectiveListParams {
  reviewType?: ReviewType
  baseDate?: string
  goalCategoryId?: number
  generalCategoryId?: number
  page?: number
  size?: number
  sort?: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  last: boolean
}

// 기존 타입 re-export (ui에서 import 경로 통일용)
export type { GoalCategory, GeneralCategoryItemType }
