'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { CalendarIcon } from '@/src/assets/svgComponents'
import { DayPicker } from '@/src/components/common/picker/DayPicker'
import { WeekPicker } from '@/src/components/common/picker/WeekPicker'
import { MonthPicker } from '@/src/components/common/picker/MonthPicker'

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
function getWeekRange(dateStr: string): { start: Date; end: Date } {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const start = new Date(d)
  start.setDate(d.getDate() + diff)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return { start, end }
}

function formatDateLabel(dateStr: string, viewType: ViewType): string {
  const d = new Date(dateStr)

  if (viewType === 'day') {
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
  }

  if (viewType === 'week') {
    const { start, end } = getWeekRange(dateStr)
    const startLabel = start.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    const endLabel = end.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    return `${startLabel} ~ ${endLabel}`
  }

  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

// ─── CalendarPopover ──────────────────────────────────────────────────────────
export function CalendarPopover() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  const viewType = getViewType(pathname)
  const today = new Date().toISOString().split('T')[0]
  const currentDate = searchParams.get('date') ?? today

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  function navigateTo(date: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('date', date)
    router.push(`${pathname}?${params.toString()}`)
    setIsOpen(false)
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

      {/* 날짜 표시 + 커스텀 달력 */}
      <div ref={containerRef} className="relative">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="label-md hover:text-foreground/70 flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors"
          aria-label="날짜 선택"
        >
          <CalendarIcon width={20} height={20} />
          {formatDateLabel(currentDate, viewType)}
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-gray-200 bg-white shadow-lg">
            {viewType === 'day' && <DayPicker currentDate={currentDate} onSelect={navigateTo} />}
            {viewType === 'week' && <WeekPicker currentDate={currentDate} onSelect={navigateTo} />}
            {viewType === 'month' && <MonthPicker currentDate={currentDate} onSelect={navigateTo} />}
          </div>
        )}
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
