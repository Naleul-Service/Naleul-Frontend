import { useQuery } from '@tanstack/react-query'
import { CHART_QUERY_KEYS } from '../constants'
import { fetchGoalCategoryDetailChart } from '../api/chart'
import { GoalCategoryChart } from '../types'

export function useGoalCategoryDetailChart() {
  return useQuery<GoalCategoryChart[]>({
    queryKey: CHART_QUERY_KEYS.goalCategoriesDetail(),
    queryFn: async () => {
      const result = await fetchGoalCategoryDetailChart()
      if (!result.success || !result.data) throw new Error(result.error ?? '조회 실패')
      return result.data
    },
  })
}
