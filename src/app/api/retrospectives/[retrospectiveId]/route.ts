// app/api/retrospectives/[retrospectiveId]/route.ts

import { NextRequest, NextResponse } from 'next/server'
import {
  deleteRetrospective,
  getRetrospective,
  updateRetrospective,
} from '@/src/features/retrospect/api/retrospectiveApi'

export async function GET(_: NextRequest, { params }: { params: Promise<{ retrospectiveId: string }> }) {
  try {
    const { retrospectiveId } = await params
    const data = await getRetrospective(Number(retrospectiveId))
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ retrospectiveId: string }> }) {
  try {
    const { retrospectiveId } = await params
    const body = await req.json()
    const data = await updateRetrospective(Number(retrospectiveId), body)
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ retrospectiveId: string }> }) {
  try {
    const { retrospectiveId } = await params
    await deleteRetrospective(Number(retrospectiveId))
    return NextResponse.json({ success: true, data: null })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 })
  }
}
