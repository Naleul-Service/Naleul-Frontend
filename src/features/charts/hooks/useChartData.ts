// src/features/charts/hooks/useChartData.ts

import { useGoalCategoryChart } from './useGoalCategoryChart'
import { useGoalCategoryDetailChart } from './useGoalCategoryDetailChart'
import { useGeneralCategoryChart } from './useGeneralCategoryChart'
import { useAchievementChart } from './useAchievementChart'

export function useChartData() {
  const goalCategory = useGoalCategoryChart()
  const goalDetail = useGoalCategoryDetailChart()
  const generalCategory = useGeneralCategoryChart()
  const achievement = useAchievementChart()

  return { goalCategory, goalDetail, generalCategory, achievement }
}
