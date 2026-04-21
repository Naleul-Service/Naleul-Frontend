import { NextResponse } from 'next/server'
import { getWeeklyTasks } from '@/src/features/schedule/week/api/week'
import { TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'

const VALID_DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

function parsePriority(value: string | null): TaskPriority | undefined {
  if (!value) return undefined
  return (TASK_PRIORITIES as readonly string[]).includes(value) ? (value as TaskPriority) : undefined
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    if (!startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'startDate, endDate는 필수입니다' }, { status: 400 })
    }

    const dayOfWeek = searchParams.get('dayOfWeek')?.toUpperCase()
    if (dayOfWeek && !VALID_DAYS.includes(dayOfWeek)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 요일입니다' }, { status: 400 })
    }

    const result = await getWeeklyTasks({
      startDate,
      endDate,
      priority: parsePriority(searchParams.get('priority')),
      goalCategoryId: searchParams.get('goalCategoryId') ? Number(searchParams.get('goalCategoryId')) : undefined,
      generalCategoryId: searchParams.get('generalCategoryId')
        ? Number(searchParams.get('generalCategoryId'))
        : undefined,
      dayOfWeek,
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '주간 할 일 조회 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '주간 할 일 조회 실패' },
      { status: 500 }
    )
  }
}
