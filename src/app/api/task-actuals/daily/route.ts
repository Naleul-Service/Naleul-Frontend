import { NextRequest, NextResponse } from 'next/server'
import { apiCallServer } from '@/src/lib/api.server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const result = await apiCallServer(`/v1/task-actuals/daily?${searchParams}`)
  return NextResponse.json(result)
}
