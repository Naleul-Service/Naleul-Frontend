'use client'

import { useState } from 'react'
import { useMonthlyTasks } from '../hooks/useMonthlyTasks'
import { CalendarGrid } from './CalendarGrid'
import { CalendarHeader } from '@/src/features/schedule/month/ui/CalendarHeader'

export function MonthCalendar() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

  const { data, isLoading } = useMonthlyTasks({ year, month })
  const tasksByDate = data ?? {} // .tasksByDate 제거

  const handlePrev = () => {
    if (month === 1) {
      setYear((y) => y - 1)
      setMonth(12)
    } else setMonth((m) => m - 1)
  }

  const handleNext = () => {
    if (month === 12) {
      setYear((y) => y + 1)
      setMonth(1)
    } else setMonth((m) => m + 1)
  }

  return (
    <div className="w-full space-y-4">
      <CalendarHeader year={year} month={month} onPrev={handlePrev} onNext={handleNext} />

      {isLoading ? (
        <div className="text-muted-foreground flex h-[400px] items-center justify-center text-sm">불러오는 중...</div>
      ) : (
        <CalendarGrid year={year} month={month} tasksByDate={tasksByDate} />
      )}
    </div>
  )
}
