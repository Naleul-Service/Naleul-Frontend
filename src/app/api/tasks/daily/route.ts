import { NextResponse } from 'next/server'
import { getDailyTasks } from '@/src/features/schedule/day/api/day'
import { TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'

function parsePriority(value: string | null): TaskPriority | undefined {
  if (!value) return undefined
  return (TASK_PRIORITIES as readonly string[]).includes(value) ? (value as TaskPriority) : undefined
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ success: false, error: 'date 필수입니다' }, { status: 400 })
    }

    const priority = parsePriority(searchParams.get('priority'))
    const goalCategoryId = searchParams.get('goalCategoryId')
    const generalCategoryId = searchParams.get('generalCategoryId')

    const result = await getDailyTasks({
      date,
      priority,
      goalCategoryId: goalCategoryId ? Number(goalCategoryId) : undefined,
      generalCategoryId: generalCategoryId ? Number(generalCategoryId) : undefined,
    })

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
