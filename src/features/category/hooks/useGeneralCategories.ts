import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateGeneralCategoryRequest, GeneralCategory } from '@/src/features/category/api/generalCategory'

async function postGeneralCategory(body: CreateGeneralCategoryRequest): Promise<GeneralCategory> {
  const res = await fetch('/api/general-categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '일반 카테고리 생성 실패')
  return json.data
}

export function useCreateGeneralCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postGeneralCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goal-categories'] })
    },
  })
}
