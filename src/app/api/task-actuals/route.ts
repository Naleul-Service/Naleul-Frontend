import { NextRequest, NextResponse } from 'next/server'
import { apiCallServer } from '@/src/lib/api.server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const result = await apiCallServer('/v1/task-actuals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return NextResponse.json(result)
}
