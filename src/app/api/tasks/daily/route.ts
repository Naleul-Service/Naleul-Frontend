import { NextResponse } from 'next/server'
import { getDailyTasks } from '@/src/features/schedule/day/api/day'

// GET /api/tasks/daily?date=2026-04-20&dayOfWeek=SUNDAY
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const dayOfWeek = searchParams.get('dayOfWeek')

    if (!date || !dayOfWeek) {
      return NextResponse.json({ success: false, error: 'date, dayOfWeek는 필수입니다' }, { status: 400 })
    }

    const result = await getDailyTasks({ date, dayOfWeek })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '일간 할 일 조회 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '일간 할 일 조회 실패' },
      { status: 500 }
    )
  }
}
