import { ApiCallResult } from '@/src/types/common'
import { AchievementChart, ChartResponse, GoalCategoryChart } from '../types'

export async function fetchGoalCategoryChart(): Promise<ApiCallResult<ChartResponse>> {
  const res = await fetch('/api/charts/goal-categories')
  return res.json()
}

export async function fetchGoalCategoryDetailChart(): Promise<ApiCallResult<GoalCategoryChart[]>> {
  const res = await fetch('/api/charts/goal-categories/detail')
  return res.json()
}

export async function fetchGeneralCategoryChart(): Promise<ApiCallResult<ChartResponse>> {
  const res = await fetch('/api/charts/general-categories')
  return res.json()
}

export async function fetchAchievementChart(): Promise<ApiCallResult<AchievementChart>> {
  const res = await fetch('/api/charts/achievement')
  return res.json()
}
