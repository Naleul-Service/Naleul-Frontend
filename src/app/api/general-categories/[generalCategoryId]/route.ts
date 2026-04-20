// app/api/general-categories/[generalCategoryId]/route.ts

import { NextResponse } from 'next/server'
import { deleteGeneralCategory, updateGeneralCategory } from '@/src/features/category/api/generalCategory'

type Params = { params: Promise<{ generalCategoryId: string }> }

// PUT /api/general-categories/[generalCategoryId]
export async function PUT(request: Request, { params }: Params) {
  try {
    const { generalCategoryId } = await params
    const body = await request.json()
    await updateGeneralCategory(Number(generalCategoryId), body)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '수정 실패' },
      { status: 500 }
    )
  }
}

// DELETE /api/general-categories/[generalCategoryId]
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { generalCategoryId } = await params
    await deleteGeneralCategory(Number(generalCategoryId))
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '삭제 실패' },
      { status: 500 }
    )
  }
}
