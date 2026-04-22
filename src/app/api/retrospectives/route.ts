// app/api/retrospectives/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createRetrospective, getRetrospectives } from '@/src/features/retrospect/api/retrospectiveApi'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const data = await getRetrospectives({
      reviewType: (searchParams.get('reviewType') as any) ?? undefined,
      baseDate: searchParams.get('baseDate') ?? undefined,
      goalCategoryId: searchParams.get('goalCategoryId') ? Number(searchParams.get('goalCategoryId')) : undefined,
      generalCategoryId: searchParams.get('generalCategoryId')
        ? Number(searchParams.get('generalCategoryId'))
        : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      size: searchParams.get('size') ? Number(searchParams.get('size')) : undefined,
      sort: searchParams.get('sort') ?? undefined,
    })
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = await createRetrospective(body)
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
