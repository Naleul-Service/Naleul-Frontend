import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateGoalCategoryRequest, GoalCategory } from '@/src/features/category/api/goalCategory'

async function fetchGoalCategories(): Promise<GoalCategory[]> {
  const res = await fetch('/api/goal-categories')
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '카테고리 조회 실패')
  return json.data
}

async function postGoalCategory(body: CreateGoalCategoryRequest): Promise<GoalCategory> {
  const res = await fetch('/api/goal-categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '카테고리 생성 실패')
  return json.data
}

export function useGoalCategories() {
  return useQuery({
    queryKey: ['goal-categories'],
    queryFn: fetchGoalCategories,
  })
}

export function useCreateGoalCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postGoalCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal-categories'] })
    },
  })
}

async function patchGeneralCategories(params: { goalCategoryId: number; generalCategoryIds: number[] }) {
  const res = await fetch(`/api/goal-categories/${params.goalCategoryId}/general-categories`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ generalCategoryIds: params.generalCategoryIds }),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '일반 카테고리 수정 실패')
}

export function useUpdateGeneralCategories() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: patchGeneralCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal-categories'] })
    },
  })
}
