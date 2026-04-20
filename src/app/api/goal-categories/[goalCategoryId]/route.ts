// app/api/category/goal-categories/[goalCategoryId]/route.ts

import { NextResponse } from 'next/server'
import { deleteGoalCategory, updateGoalCategory } from '@/src/features/category/api/goalCategory'

type Params = { params: Promise<{ goalCategoryId: string }> }

// PATCH /api/category/goal-categories/[goalCategoryId]
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { goalCategoryId } = await params
    const body = await request.json()
    await updateGoalCategory(Number(goalCategoryId), body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '수정 실패' },
      { status: 500 }
    )
  }
}

// DELETE /api/category/goal-categories/[goalCategoryId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { goalCategoryId } = await params
    await deleteGoalCategory(Number(goalCategoryId))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '삭제 실패' },
      { status: 500 }
    )
  }
}
