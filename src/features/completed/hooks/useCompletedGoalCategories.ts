import { useInfiniteQuery } from '@tanstack/react-query'
import { CompletedGoalCategoryPage } from '../types'

const PAGE_SIZE = 10

async function fetchCompleted(page: number): Promise<CompletedGoalCategoryPage> {
  const res = await fetch(`/api/goal-categories/completed?page=${page}&size=${PAGE_SIZE}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '완료 목록 조회 실패')
  return json.data
}

export function useCompletedGoalCategories() {
  return useInfiniteQuery({
    queryKey: ['goal-categories', 'completed'],
    queryFn: ({ pageParam = 0 }) => fetchCompleted(pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  })
}
