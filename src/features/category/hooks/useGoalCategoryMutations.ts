// features/category/hooks/useGoalCategoryMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CompleteGoalCategoryRequest, GoalCategory, UpdateGoalCategoryRequest } from '../api/goalCategory'

const GOAL_CATEGORIES_KEY = ['goal-categories'] as const

// ── 삭제 ─────────────────────────────────────────────────────
async function fetchDeleteGoalCategory(goalCategoryId: number): Promise<void> {
  const res = await fetch(`/api/goal-categories/${goalCategoryId}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '목표 카테고리 삭제 실패')
}

export function useDeleteGoalCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchDeleteGoalCategory,

    onMutate: async (goalCategoryId) => {
      await queryClient.cancelQueries({ queryKey: GOAL_CATEGORIES_KEY })
      const previous = queryClient.getQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY)

      queryClient.setQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY, (prev) =>
        prev?.filter((c) => c.goalCategoryId !== goalCategoryId)
      )

      return { previous }
    },

    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(GOAL_CATEGORIES_KEY, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_CATEGORIES_KEY })
    },
  })
}

// ── 수정 ─────────────────────────────────────────────────────
async function fetchUpdateGoalCategory({
  goalCategoryId,
  body,
}: {
  goalCategoryId: number
  body: UpdateGoalCategoryRequest
}): Promise<void> {
  const res = await fetch(`/api/goal-categories/${goalCategoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '목표 카테고리 수정 실패')
}

export function useUpdateGoalCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchUpdateGoalCategory,

    onMutate: async ({ goalCategoryId, body }) => {
      await queryClient.cancelQueries({ queryKey: GOAL_CATEGORIES_KEY })
      const previous = queryClient.getQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY)

      queryClient.setQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY, (prev) =>
        prev?.map((c) =>
          c.goalCategoryId === goalCategoryId
            ? {
                ...c,
                goalCategoryName: body.goalCategoryName,
                goalCategoryStatus: body.goalCategoryStatus,
                goalCategoryStartDate: body.goalCategoryStartDate,
              }
            : c
        )
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(GOAL_CATEGORIES_KEY, context.previous)
      }
    },

    onSettled: () => {
      // colorCode는 colorId로만 오므로 서버에서 재조회해야 반영됨
      queryClient.invalidateQueries({ queryKey: GOAL_CATEGORIES_KEY })
    },
  })
}

// ── 완료 처리 ─────────────────────────────────────────────────
async function fetchCompleteGoalCategory({
  goalCategoryId,
  body,
}: {
  goalCategoryId: number
  body: CompleteGoalCategoryRequest
}): Promise<void> {
  const res = await fetch(`/api/goal-categories/${goalCategoryId}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '목표 완료 처리 실패')
}

export function useCompleteGoalCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchCompleteGoalCategory,

    onMutate: async ({ goalCategoryId, body }) => {
      await queryClient.cancelQueries({ queryKey: GOAL_CATEGORIES_KEY })
      const previous = queryClient.getQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY)

      queryClient.setQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY, (prev) =>
        prev?.map((c) =>
          c.goalCategoryId === goalCategoryId
            ? {
                ...c,
                goalCategoryStatus: 'COMPLETED',
                goalCategoryEndDate: body.goalCategoryEndDate,
                achievement: body.achievement,
              }
            : c
        )
      )

      return { previous }
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(GOAL_CATEGORIES_KEY, context.previous)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOAL_CATEGORIES_KEY })
    },
  })
}
