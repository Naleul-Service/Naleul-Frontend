// features/retrospective/api/retrospectiveApi.ts

import { apiCallServer } from '@/src/lib/api.server'
import type {
  PageResponse,
  RetrospectiveCreateRequest,
  RetrospectiveListParams,
  RetrospectiveResponse,
  RetrospectiveUpdateRequest,
} from '../types'

const BASE = '/v1/retrospectives'

export async function getRetrospective(retrospectiveId: number): Promise<RetrospectiveResponse> {
  const result = await apiCallServer<RetrospectiveResponse>(`${BASE}/${retrospectiveId}`)
  if (!result.success) throw new Error(result.error ?? '회고 조회 실패')
  return result.data!
}

export async function getRetrospectives(
  params: RetrospectiveListParams = {}
): Promise<PageResponse<RetrospectiveResponse>> {
  const query = new URLSearchParams()
  if (params.reviewType) query.set('reviewType', params.reviewType)
  if (params.baseDate) query.set('baseDate', params.baseDate)
  if (params.goalCategoryId != null) query.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) query.set('generalCategoryId', String(params.generalCategoryId))
  if (params.page != null) query.set('page', String(params.page))
  if (params.size != null) query.set('size', String(params.size))
  if (params.sort) query.set('sort', params.sort)

  const qs = query.toString()
  const result = await apiCallServer<PageResponse<RetrospectiveResponse>>(qs ? `${BASE}?${qs}` : BASE)
  if (!result.success) throw new Error(result.error ?? '회고 목록 조회 실패')
  return result.data!
}

export async function createRetrospective(body: RetrospectiveCreateRequest): Promise<RetrospectiveResponse> {
  const result = await apiCallServer<RetrospectiveResponse>(BASE, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '회고 생성 실패')
  return result.data!
}

export async function updateRetrospective(
  retrospectiveId: number,
  body: RetrospectiveUpdateRequest
): Promise<RetrospectiveResponse> {
  const result = await apiCallServer<RetrospectiveResponse>(`${BASE}/${retrospectiveId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '회고 수정 실패')
  return result.data!
}

export async function deleteRetrospective(retrospectiveId: number): Promise<void> {
  const result = await apiCallServer(`${BASE}/${retrospectiveId}`, {
    method: 'DELETE',
  })
  if (!result.success) throw new Error(result.error ?? '회고 삭제 실패')
}
