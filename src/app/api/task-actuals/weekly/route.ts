// src/app/api/task-actuals/weekly/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { WeeklyActualsParams } from '@/src/features/schedule/week/types'
import { getWeeklyActuals } from '@/src/features/schedule/week/api/week'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const params: WeeklyActualsParams = {
    startDate: searchParams.get('startDate') ?? '',
    endDate: searchParams.get('endDate') ?? '',
    goalCategoryId: searchParams.get('goalCategoryId') ? Number(searchParams.get('goalCategoryId')) : undefined,
    generalCategoryId: searchParams.get('generalCategoryId')
      ? Number(searchParams.get('generalCategoryId'))
      : undefined,
  }

  const result = await getWeeklyActuals(params)

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  }

  return NextResponse.json({ success: true, data: result.data })
}
