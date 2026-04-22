import { ApiCallResult } from '@/src/types/common'
import { ChartResponse, GoalCategoryChart } from '../types'

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
