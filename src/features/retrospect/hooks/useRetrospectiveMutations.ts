// features/retrospective/hooks/useRetrospectiveMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { RetrospectiveCreateRequest, RetrospectiveUpdateRequest } from '../types'
import { retrospectiveKeys } from './useRetrospectiveList'

async function postRetrospective(body: RetrospectiveCreateRequest) {
  const res = await fetch('/api/retrospectives', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '회고 생성 실패')
  return json.data
}

async function patchRetrospective(params: { retrospectiveId: number; body: RetrospectiveUpdateRequest }) {
  const res = await fetch(`/api/retrospectives/${params.retrospectiveId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '회고 수정 실패')
  return json.data
}

async function deleteRetrospective(retrospectiveId: number) {
  const res = await fetch(`/api/retrospectives/${retrospectiveId}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '회고 삭제 실패')
}

export function useCreateRetrospective() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveKeys.all })
    },
  })
}

export function useUpdateRetrospective(retrospectiveId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: RetrospectiveUpdateRequest) => patchRetrospective({ retrospectiveId, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveKeys.all })
      queryClient.invalidateQueries({ queryKey: retrospectiveKeys.detail(retrospectiveId) })
    },
  })
}

export function useDeleteRetrospective() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteRetrospective,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveKeys.all })
    },
  })
}
