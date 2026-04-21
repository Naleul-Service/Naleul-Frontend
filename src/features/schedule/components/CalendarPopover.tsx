'use client'

import { useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/src/components/common/Button'

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
  // "4월 23일 (목)"
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export function CalendarPopover() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const today = new Date().toISOString().split('T')[0]
  const currentDate = searchParams.get('date') ?? today

  function navigateTo(date: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(`${pathname}?${params.toString()}`)
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return
    navigateTo(e.target.value)
  }

  return (
    <div className="flex items-center gap-1">
      {/* 이전 날짜 */}
      <Button
        variant="ghost"
        size="iconSm"
        aria-label="이전 날짜"
        onClick={() => navigateTo(shiftDate(currentDate, -1))}
      >
        <ChevronLeft size={16} />
      </Button>

      {/* 날짜 표시 + 달력 열기 */}
      <div className="relative">
        <button
          onClick={() => inputRef.current?.showPicker()}
          className="text-foreground hover:text-foreground/70 flex items-center gap-1.5 text-sm font-medium transition-colors"
          aria-label="날짜 선택"
        >
          <CalendarIcon size={14} className="text-muted-foreground" />
          {formatDateLabel(currentDate)}
        </button>

        <input
          ref={inputRef}
          type="date"
          className="pointer-events-none absolute inset-0 opacity-0"
          onChange={handleDateChange}
          value={currentDate}
        />
      </div>

      {/* 다음 날짜 */}
      <Button
        variant="ghost"
        size="iconSm"
        aria-label="다음 날짜"
        onClick={() => navigateTo(shiftDate(currentDate, 1))}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  )
}
