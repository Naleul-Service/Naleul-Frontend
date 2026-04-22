// features/retrospective/hooks/useRetrospectiveList.ts

import { useQuery } from '@tanstack/react-query'
import type { PageResponse, RetrospectiveListParams, RetrospectiveResponse } from '../types'

export const retrospectiveKeys = {
  all: ['retrospectives'] as const,
  list: (params: RetrospectiveListParams) => [...retrospectiveKeys.all, 'list', params] as const,
  detail: (id: number) => [...retrospectiveKeys.all, 'detail', id] as const,
}

async function fetchRetrospectives(params: RetrospectiveListParams): Promise<PageResponse<RetrospectiveResponse>> {
  const query = new URLSearchParams()
  if (params.reviewType) query.set('reviewType', params.reviewType)
  if (params.baseDate) query.set('baseDate', params.baseDate)
  if (params.goalCategoryId != null) query.set('goalCategoryId', String(params.goalCategoryId))
  if (params.generalCategoryId != null) query.set('generalCategoryId', String(params.generalCategoryId))
  if (params.page != null) query.set('page', String(params.page))
  if (params.size != null) query.set('size', String(params.size))
  if (params.sort) query.set('sort', params.sort)

  const qs = query.toString()
  const res = await fetch(qs ? `/api/retrospectives?${qs}` : '/api/retrospectives')
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '회고 목록 조회 실패')
  return json.data
}

export function useRetrospectiveList(params: RetrospectiveListParams = {}) {
  return useQuery({
    queryKey: retrospectiveKeys.list(params),
    queryFn: () => fetchRetrospectives(params),
  })
}
