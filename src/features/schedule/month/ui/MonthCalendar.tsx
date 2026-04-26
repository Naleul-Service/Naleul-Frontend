'use client'

import { useMonthlyTasks } from '../hooks/useMonthlyTasks'
import { CalendarGrid } from './CalendarGrid'
import { useSearchParams } from 'next/navigation'

export function MonthCalendar() {
  const searchParams = useSearchParams()
  const dateParam = searchParams.get('date') ?? new Date().toISOString().split('T')[0]
  const d = new Date(dateParam)
  const year = d.getFullYear()
  const month = d.getMonth() + 1

  const { data, isLoading } = useMonthlyTasks({ year, month })
  const tasksByDate = data ?? {}

  return (
    <div className="w-full space-y-4">
      {isLoading ? (
        <div className="text-muted-foreground flex h-[400px] items-center justify-center text-sm">불러오는 중...</div>
      ) : (
        <CalendarGrid year={year} month={month} tasksByDate={tasksByDate} />
      )}
    </div>
  )
}
