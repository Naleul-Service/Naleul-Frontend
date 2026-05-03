import { NextResponse } from 'next/server'
import { deleteColor } from '@/src/features/color/api/colors'

export async function DELETE(_request: Request, { params }: { params: Promise<{ colorId: string }> }) {
  try {
    const { colorId } = await params
    const colorIdNum = Number(colorId)

    if (isNaN(colorIdNum)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 colorId' }, { status: 400 })
    }

    await deleteColor(colorIdNum)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '색상 삭제 실패' },
      { status: 500 }
    )
  }
}
