import { NextResponse } from 'next/server'
import { deleteTask, updateTask } from '@/src/features/task/api/task'

export async function DELETE(_request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const id = Number(taskId)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: '잘못된 taskId' }, { status: 400 })
  }

  try {
    const result = await deleteTask(id)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '삭제 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '삭제 실패' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const id = Number(taskId)

  if (isNaN(id)) {
    return NextResponse.json({ success: false, error: '잘못된 taskId' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const result = await updateTask(id, body)

    console.log('[PUT /api/tasks] result:', JSON.stringify(result))

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error ?? '수정 실패' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '수정 실패' },
      { status: 500 }
    )
  }
}
