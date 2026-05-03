import { NextResponse } from 'next/server'
import { patchActualTask } from '@/src/features/task/api/task'

export async function PATCH(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  try {
    const { taskId: taskIdStr } = await params
    const taskId = Number(taskIdStr)

    if (isNaN(taskId)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 taskId' }, { status: 400 })
    }

    const body = await request.json()

    if (!body.actualStartAt || !body.actualEndAt) {
      return NextResponse.json({ success: false, error: 'actualStartAt, actualEndAt은 필수입니다' }, { status: 400 })
    }

    const result = await patchActualTask(taskId, body)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '실제 시간 저장 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '실제 시간 저장 실패' },
      { status: 500 }
    )
  }
}
