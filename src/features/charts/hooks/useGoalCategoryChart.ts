import { useQuery } from '@tanstack/react-query'
import { CHART_QUERY_KEYS } from '../constants'
import { fetchGoalCategoryChart } from '../api/chart'
import { ChartResponse } from '../types'

export function useGoalCategoryChart() {
  return useQuery<ChartResponse>({
    queryKey: CHART_QUERY_KEYS.goalCategories(),
    queryFn: async () => {
      const result = await fetchGoalCategoryChart()
      if (!result.success || !result.data) throw new Error(result.error ?? '조회 실패')
      return result.data
    },
  })
}
