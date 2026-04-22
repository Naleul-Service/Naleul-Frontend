import { apiCallServer } from '@/src/lib/api.server'
import { CompletedGoalCategoryPage } from '../types'

export async function getCompletedGoalCategories(page = 0, size = 10): Promise<CompletedGoalCategoryPage> {
  const result = await apiCallServer<CompletedGoalCategoryPage>(
    `/v1/goal-categories/completed?page=${page}&size=${size}`
  )
  if (!result.success) throw new Error(result.error ?? '완료 목록 조회 실패')
  return result.data!
}
