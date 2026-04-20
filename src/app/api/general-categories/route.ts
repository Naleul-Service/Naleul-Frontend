import { NextResponse } from 'next/server'
import { createGeneralCategory, CreateGeneralCategoryRequest } from '@/src/features/category/api/generalCategory'

export async function POST(request: Request) {
  try {
    const body: CreateGeneralCategoryRequest = await request.json()
    const data = await createGeneralCategory(body)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '일반 카테고리 생성 실패' },
      { status: 500 }
    )
  }
}
