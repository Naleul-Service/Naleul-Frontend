import { NextResponse } from 'next/server'
import {
  createGoalCategory,
  CreateGoalCategoryRequest,
  getGoalCategories,
} from '@/src/features/category/api/goalCategory'

export async function GET() {
  try {
    const data = await getGoalCategories()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '카테고리 조회 실패' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateGoalCategoryRequest = await request.json()
    const data = await createGoalCategory(body)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '카테고리 생성 실패' },
      { status: 500 }
    )
  }
}
