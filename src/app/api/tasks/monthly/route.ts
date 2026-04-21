import { NextResponse } from 'next/server'
import { getMonthlyTasks } from '@/src/features/schedule/month/api/month'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const yearStr = searchParams.get('year')
    const monthStr = searchParams.get('month')

    if (!yearStr || !monthStr) {
      return NextResponse.json({ success: false, error: 'year, month는 필수입니다' }, { status: 400 })
    }

    const year = Number(yearStr)
    const month = Number(monthStr)

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return NextResponse.json({ success: false, error: '유효하지 않은 year 또는 month입니다' }, { status: 400 })
    }

    const result = await getMonthlyTasks({ year, month })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '월간 할 일 조회 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '월간 할 일 조회 실패',
      },
      { status: 500 }
    )
  }
}
