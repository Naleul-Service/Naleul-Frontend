'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/src/lib/utils'

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getWeekRange(dateStr: string): { start: Date; end: Date } {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const start = new Date(d)
  start.setDate(d.getDate() + diff)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}

interface WeekPickerProps {
  currentDate: string
  onSelect: (date: string) => void
}

export function WeekPicker({ currentDate, onSelect }: WeekPickerProps) {
  const [viewYear, setViewYear] = useState(() => new Date(currentDate).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date(currentDate).getMonth() + 1)

  const { start: selectedStart, end: selectedEnd } = getWeekRange(currentDate)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isInSelectedWeek = (day: number) => {
    const d = new Date(viewYear, viewMonth - 1, day)
    return d >= selectedStart && d <= selectedEnd
  }

  const isWeekStart = (day: number) => toDateStr(new Date(viewYear, viewMonth - 1, day)) === toDateStr(selectedStart)

  const isWeekEnd = (day: number) => toDateStr(new Date(viewYear, viewMonth - 1, day)) === toDateStr(selectedEnd)

  function prevMonth() {
    if (viewMonth === 1) {
      setViewMonth(12)
      setViewYear((y) => y - 1)
    } else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1)
      setViewYear((y) => y + 1)
    } else setViewMonth((m) => m + 1)
  }

  function handleSelect(day: number) {
    onSelect(toDateStr(new Date(viewYear, viewMonth - 1, day)))
  }

  return (
    <div className="w-[280px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="body-md-medium text-gray-700">
          {viewYear}년 {viewMonth}월
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7">
        {DAYS_OF_WEEK.map((d, i) => (
          <span
            key={d}
            className={cn(
              'caption-md flex h-8 items-center justify-center text-gray-400',
              i === 0 && 'text-red-400',
              i === 6 && 'text-blue-400'
            )}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, idx) => (
          <button
            key={idx}
            type="button"
            disabled={day === null}
            onClick={() => day && handleSelect(day)}
            className={cn(
              'caption-md flex h-8 w-full items-center justify-center transition-colors',
              day === null && 'invisible',
              day !== null && !isInSelectedWeek(day) && 'rounded-full hover:bg-gray-100',
              day !== null && isInSelectedWeek(day) && 'bg-primary-100',
              day !== null && isWeekStart(day) && 'bg-primary-400 rounded-l-full font-bold text-white',
              day !== null && isWeekEnd(day) && 'bg-primary-400 rounded-r-full font-bold text-white'
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
