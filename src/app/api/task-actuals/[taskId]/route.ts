// src/app/api/task-actuals/[taskActualId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { deleteTaskActual, patchTaskActual } from '@/src/features/schedule/day/api/day'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const body = await req.json()
  const result = await patchTaskActual(Number(taskId), body)
  return NextResponse.json(result)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const result = await deleteTaskActual(Number(taskId))
  return NextResponse.json(result)
}
