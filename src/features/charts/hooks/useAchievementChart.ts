import { useQuery } from '@tanstack/react-query'
import { CHART_QUERY_KEYS } from '../constants'
import { fetchAchievementChart } from '../api/chart'
import { AchievementChart } from '../types'

export function useAchievementChart() {
  return useQuery<AchievementChart>({
    queryKey: CHART_QUERY_KEYS.achievement(),
    queryFn: async () => {
      const result = await fetchAchievementChart()
      if (!result.success || !result.data) throw new Error(result.error ?? '조회 실패')
      return result.data
    },
  })
}
