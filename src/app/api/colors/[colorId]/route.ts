import { NextResponse } from 'next/server'
import { deleteColor } from '@/src/features/category/api/colors'

export async function DELETE(_request: Request, { params }: { params: { colorId: string } }) {
  try {
    const colorId = Number(params.colorId)
    if (isNaN(colorId)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 colorId' }, { status: 400 })
    }

    await deleteColor(colorId)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '색상 삭제 실패' },
      { status: 500 }
    )
  }
}
