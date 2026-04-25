'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/src/lib/utils'

const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']

interface MonthPickerProps {
  currentDate: string
  onSelect: (date: string) => void
}

export function MonthPicker({ currentDate, onSelect }: MonthPickerProps) {
  const current = new Date(currentDate)
  const [viewYear, setViewYear] = useState(current.getFullYear())
  const selectedMonth = current.getMonth() + 1
  const selectedYear = current.getFullYear()

  function handleSelect(month: number) {
    const m = String(month).padStart(2, '0')
    onSelect(`${viewYear}-${m}-01`)
  }

  return (
    <div className="w-[240px] p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewYear((y) => y - 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={15} />
        </button>
        <span className="body-md-medium text-gray-700">{viewYear}년</span>
        <button
          type="button"
          onClick={() => setViewYear((y) => y + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((label, idx) => {
          const month = idx + 1
          const isSelected = viewYear === selectedYear && month === selectedMonth
          return (
            <button
              key={month}
              type="button"
              onClick={() => handleSelect(month)}
              className={cn(
                'caption-md flex h-10 items-center justify-center rounded-lg transition-colors',
                isSelected ? 'bg-primary-400 font-bold text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
