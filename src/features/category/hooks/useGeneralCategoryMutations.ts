// features/category/hooks/useGeneralCategoryMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UpdateGeneralCategoryRequest } from '../api/generalCategory'
import { GoalCategory } from '../api/goalCategory'

const GOAL_CATEGORIES_KEY = ['goal-categories'] as const

// ── 수정 ─────────────────────────────────────────────────────
async function fetchUpdateGeneralCategory({
  generalCategoryId,
  body,
}: {
  generalCategoryId: number
  body: UpdateGeneralCategoryRequest
}): Promise<void> {
  const res = await fetch(`/api/general-categories/${generalCategoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '일반 카테고리 수정 실패')
}

export function useUpdateGeneralCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchUpdateGeneralCategory,

    onMutate: async ({ generalCategoryId, body }) => {
      await queryClient.cancelQueries({ queryKey: GOAL_CATEGORIES_KEY })
      const previous = queryClient.getQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY)

      // 이름만 optimistic 반영 (colorCode는 colorId → code 매핑 불가로 서버 재조회)
      queryClient.setQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY, (prev) =>
        prev?.map((cat) => ({
          ...cat,
          generalCategories: cat.generalCategories.map((g) =>
            g.generalCategoryId === generalCategoryId ? { ...g, generalCategoryName: body.generalCategoryName } : g
          ),
        }))
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

// ── 삭제 ─────────────────────────────────────────────────────
async function fetchDeleteGeneralCategory(generalCategoryId: number): Promise<void> {
  const res = await fetch(`/api/general-categories/${generalCategoryId}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '일반 카테고리 삭제 실패')
}

export function useDeleteGeneralCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: fetchDeleteGeneralCategory,

    onMutate: async (generalCategoryId) => {
      await queryClient.cancelQueries({ queryKey: GOAL_CATEGORIES_KEY })
      const previous = queryClient.getQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY)

      queryClient.setQueryData<GoalCategory[]>(GOAL_CATEGORIES_KEY, (prev) =>
        prev?.map((cat) => ({
          ...cat,
          generalCategories: cat.generalCategories.filter((g) => g.generalCategoryId !== generalCategoryId),
        }))
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
