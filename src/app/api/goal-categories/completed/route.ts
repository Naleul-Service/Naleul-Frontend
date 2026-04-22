import { NextRequest, NextResponse } from 'next/server'
import { getCompletedGoalCategories } from '@/src/features/completed/api/completed'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const page = Number(searchParams.get('page') ?? 0)
    const size = Number(searchParams.get('size') ?? 10)
    const data = await getCompletedGoalCategories(page, size)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '완료 목록 조회 실패' },
      { status: 500 }
    )
  }
}
