import { NextResponse } from 'next/server'
import { updateGeneralCategories } from '@/src/features/category/api/goalCategory'

export async function PATCH(request: Request, { params }: { params: Promise<{ goalCategoryId: string }> }) {
  try {
    const { goalCategoryId } = await params
    const body = await request.json()
    await updateGeneralCategories(Number(goalCategoryId), body.generalCategoryIds)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '수정 실패' },
      { status: 500 }
    )
  }
}
