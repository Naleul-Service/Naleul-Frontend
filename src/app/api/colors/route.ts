import { NextResponse } from 'next/server'
import { getColors } from '@/src/features/category/api/colors'

export async function GET() {
  try {
    const data = await getColors()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '색상 조회 실패' },
      { status: 500 }
    )
  }
}
