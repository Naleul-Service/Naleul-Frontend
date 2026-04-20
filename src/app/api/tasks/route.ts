import { NextResponse } from 'next/server'
import { createTask } from '@/src/features/task/api/task'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = await createTask(body)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '할 일 생성 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '할 일 생성 실패' },
      { status: 500 }
    )
  }
}
