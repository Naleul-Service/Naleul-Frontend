'use client'

import { useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { CalendarIcon } from '@/src/assets/svgComponents'

// ─── 뷰 타입 ─────────────────────────────────────────────────────────────────
type ViewType = 'day' | 'week' | 'month'

function getViewType(pathname: string): ViewType {
  if (pathname.includes('/week')) return 'week'
  if (pathname.includes('/month')) return 'month'
  return 'day'
}

// ─── 날짜 이동 ────────────────────────────────────────────────────────────────
function shiftDate(dateStr: string, viewType: ViewType, direction: number): string {
  const d = new Date(dateStr)
  if (viewType === 'day') {
    d.setDate(d.getDate() + direction)
  } else if (viewType === 'week') {
    d.setDate(d.getDate() + direction * 7)
  } else {
    d.setMonth(d.getMonth() + direction)
  }
  return d.toISOString().split('T')[0]
}

// ─── 라벨 포맷 ────────────────────────────────────────────────────────────────
function formatDateLabel(dateStr: string, viewType: ViewType): string {
  const d = new Date(dateStr)

  if (viewType === 'day') {
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
    // "4월 23일 (목)"
  }

  if (viewType === 'week') {
    const startOfWeek = new Date(d)
    const day = d.getDay()
    // 월요일 기준
    const diff = day === 0 ? -6 : 1 - day
    startOfWeek.setDate(d.getDate() + diff)
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    const startLabel = startOfWeek.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    const endLabel = endOfWeek.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    return `${startLabel} ~ ${endLabel}`
    // "4월 21일 ~ 4월 27일"
  }

  // month
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
  // "2025년 4월"
}

// ─── CalendarPopover ──────────────────────────────────────────────────────────
export function CalendarPopover() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const viewType = getViewType(pathname)
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
    <div className="flex h-[40px] items-center gap-1 rounded-[8px] border border-gray-100">
      {/* 이전 */}
      <Button
        variant="ghost"
        size="iconSm"
        aria-label="이전"
        onClick={() => navigateTo(shiftDate(currentDate, viewType, -1))}
      >
        <ChevronLeft size={16} className="text-[#8FA0A8]" />
      </Button>

      {/* 날짜 표시 + 달력 열기 */}
      <div className="relative">
        <button
          onClick={() => inputRef.current?.showPicker()}
          className="label-md hover:text-foreground/70 flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors"
          aria-label="날짜 선택"
        >
          <CalendarIcon width={20} height={20} />
          {formatDateLabel(currentDate, viewType)}
        </button>

        <input
          ref={inputRef}
          type="date"
          className="pointer-events-none absolute inset-0 opacity-0"
          onChange={handleDateChange}
          value={currentDate}
        />
      </div>

      {/* 다음 */}
      <Button
        variant="ghost"
        size="iconSm"
        aria-label="다음"
        onClick={() => navigateTo(shiftDate(currentDate, viewType, 1))}
      >
        <ChevronRight size={16} className="text-[#8FA0A8]" />
      </Button>
    </div>
  )
}
