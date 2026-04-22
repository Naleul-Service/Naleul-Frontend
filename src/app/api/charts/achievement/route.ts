import { apiCallServer } from '@/src/lib/api.server'
import { AchievementChart } from '@/src/features/charts/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await apiCallServer<AchievementChart>('/v1/charts/achievement')
  return NextResponse.json(result)
}
