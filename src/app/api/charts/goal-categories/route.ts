import { apiCallServer } from '@/src/lib/api.server'
import { ChartResponse } from '@/src/features/charts/types'
import { NextResponse } from 'next/server'

export async function GET() {
  const result = await apiCallServer<ChartResponse>('/v1/charts/goal-categories')
  return NextResponse.json(result)
}
