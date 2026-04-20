// app/api/category/goal-categories/[goalCategoryId]/complete/route.ts

import { NextResponse } from 'next/server'
import { completeGoalCategory } from '@/src/features/category/api/goalCategory'

type Params = { params: Promise<{ goalCategoryId: string }> }

// PATCH /api/category/goal-categories/[goalCategoryId]/complete
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { goalCategoryId } = await params
    const body = await request.json()
    await completeGoalCategory(Number(goalCategoryId), body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '완료 처리 실패' },
      { status: 500 }
    )
  }
}
