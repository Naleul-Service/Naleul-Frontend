import { apiCallServer } from '@/src/lib/api.server'
import { GoalCategoryChart } from '@/src/features/charts/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await apiCallServer<GoalCategoryChart[]>('/v1/charts/goal-categories/detail')
  return NextResponse.json(result)
}
