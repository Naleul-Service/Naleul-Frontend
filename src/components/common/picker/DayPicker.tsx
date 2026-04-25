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

interface DayPickerProps {
  currentDate: string
  onSelect: (date: string) => void
}

export function DayPicker({ currentDate, onSelect }: DayPickerProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(() => new Date(currentDate).getFullYear())
  const [viewMonth, setViewMonth] = useState(() => new Date(currentDate).getMonth() + 1)

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedDate = new Date(currentDate)

  const isSelected = (day: number) =>
    selectedDate.getFullYear() === viewYear &&
    selectedDate.getMonth() + 1 === viewMonth &&
    selectedDate.getDate() === day

  const isToday = (day: number) =>
    today.getFullYear() === viewYear && today.getMonth() + 1 === viewMonth && today.getDate() === day

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
    const d = new Date(viewYear, viewMonth - 1, day)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    onSelect(`${y}-${m}-${dd}`)
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
              'caption-md flex h-8 w-full items-center justify-center rounded-full transition-colors',
              day === null && 'invisible',
              day !== null && !isSelected(day) && 'hover:bg-gray-100',
              isToday(day!) && !isSelected(day!) && 'text-primary-400 font-bold',
              isSelected(day!) && 'bg-primary-400 font-bold text-white',
              idx % 7 === 0 && !isSelected(day!) && 'text-red-400',
              idx % 7 === 6 && !isSelected(day!) && 'text-blue-400'
            )}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
