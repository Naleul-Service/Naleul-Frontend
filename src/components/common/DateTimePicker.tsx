'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import Label from '@/src/components/common/Label'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DateTimePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  isRequired?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

interface DateTimeParts {
  year: string
  month: string
  day: string
  meridiem: 'AM' | 'PM'
  hour: string
  minute: string
}

// ─── 변환 유틸 ────────────────────────────────────────────────────────────────

/**
 * "2026-04-26T00:30" → DateTimeParts (12시간제)
 * - 00시 → 오전 12시
 * - 13시 → 오후 01시
 */
function toDateTimeParts(value: string): DateTimeParts {
  if (!value) {
    return { year: '', month: '', day: '', meridiem: 'AM', hour: '', minute: '' }
  }
  const [datePart, timePart] = value.split('T')
  const [year, month, day] = datePart.split('-')
  const [h, minute] = (timePart ?? '').split(':')
  const hour24 = parseInt(h ?? '0', 10)
  const meridiem = hour24 < 12 ? 'AM' : 'PM'
  // 00시 → 12 (오전 12시 = 자정), 12시 → 12 (오후 12시 = 정오), 13시 → 1, ...
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
  return {
    year: year ?? '',
    month: month ?? '',
    day: day ?? '',
    meridiem,
    hour: String(hour12).padStart(2, '0'),
    minute: minute ?? '',
  }
}

/**
 * DateTimeParts → "2026-04-26T00:30" (24시간제 ISO)
 * - 오전 12시 → 00시 (자정)
 * - 오후 12시 → 12시 (정오)
 */
function toDateTimeString(parts: DateTimeParts): string {
  const { year, month, day, meridiem, hour, minute } = parts
  if (!year || !month || !day || !hour || !minute) return ''
  const h = parseInt(hour, 10)
  let hour24: number
  if (meridiem === 'AM') {
    hour24 = h === 12 ? 0 : h
  } else {
    hour24 = h === 12 ? 12 : h + 12
  }
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${String(hour24).padStart(2, '0')}:${minute.padStart(2, '0')}`
}

// ─── 달력 유틸 ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'] as const

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay()
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DateTimePicker({
  value,
  onChange,
  label,
  isRequired,
  error,
  disabled,
  className,
}: DateTimePickerProps) {
  const [parts, setParts] = useState<DateTimeParts>(() => toDateTimeParts(value))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [calendarYear, setCalendarYear] = useState(() => {
    const p = toDateTimeParts(value)
    return parseInt(p.year || String(new Date().getFullYear()), 10)
  })
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const p = toDateTimeParts(value)
    return parseInt(p.month || String(new Date().getMonth() + 1), 10)
  })

  // 포커스 중인 필드 추적 — 외부 value 동기화를 포커스 중엔 막기 위해
  const focusedFieldRef = useRef<keyof DateTimeParts | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fieldRefs = useRef<Partial<Record<keyof DateTimeParts, HTMLInputElement | null>>>({})

  // value prop 변경 시 내부 상태 동기화 — 포커스 중이면 완전히 무시
  useEffect(() => {
    if (focusedFieldRef.current !== null) return
    setParts(toDateTimeParts(value))
  }, [value])

  // 외부 클릭 시 달력 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false)
      }
    }

    if (isCalendarOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCalendarOpen])

  // ─── 핸들러 ─────────────────────────────────────────────────────────────────

  function commitParts(next: DateTimeParts) {
    setParts(next)
    const result = toDateTimeString(next)
    if (result) onChange(result)
  }

  /**
   * 숫자 입력 핸들러
   * - 자동 포커스 이동 없음 (year/month/day/hour/minute 모두)
   * - 숫자만 허용
   */
  function handleNumberChange(key: keyof DateTimeParts, raw: string) {
    const digits = raw.replace(/\D/g, '')
    const updated = { ...parts, [key]: digits }
    setParts(updated)

    const result = toDateTimeString(updated)
    if (result) onChange(result)
  }

  /** 포커스 시 해당 필드 초기화 (재입력 편의성) */
  function handleNumberFocus(key: keyof DateTimeParts) {
    focusedFieldRef.current = key
    setParts((prev) => ({ ...prev, [key]: '' }))
  }

  /**
   * blur 시 유효값으로 보정
   *
   * hour 규칙 (12시간제):
   *   - 0 입력 → 12로 보정 (오전 12시 = 자정, 오후 12시 = 정오)
   *   - 1~12 → 그대로
   *   - 13 이상 → 12로 clamp
   *
   * minute 규칙:
   *   - min=0 허용 (00분)
   *
   * 나머지(year/month/day):
   *   - min~max 범위로 clamp
   */
  function handleNumberBlur(key: keyof DateTimeParts, max: number, min: number = 1) {
    setTimeout(() => {
      // blur 후 포커스가 컨테이너 내부로 이동했으면 패딩 스킵
      if (containerRef.current?.contains(document.activeElement)) {
        focusedFieldRef.current = (document.activeElement as HTMLElement).getAttribute('data-field') as
          | keyof DateTimeParts
          | null
        return
      }

      focusedFieldRef.current = null
      const raw = parts[key] as string
      const num = parseInt(raw, 10)
      if (!raw || isNaN(num)) return

      let clamped: number
      if (key === 'hour') {
        // 0 입력 시 12로 보정 (12시간제에서 0시 없음)
        clamped = num === 0 ? 12 : Math.min(Math.max(num, 1), 12)
      } else {
        clamped = Math.min(Math.max(num, min), max)
      }

      const padLength = key === 'year' ? 4 : 2
      const padded = String(clamped).padStart(padLength, '0')
      commitParts({ ...parts, [key]: padded })
    }, 0)
  }

  function handleMeridiemToggle() {
    commitParts({ ...parts, meridiem: parts.meridiem === 'AM' ? 'PM' : 'AM' })
  }

  function handleSelectDate(day: number) {
    const month = String(calendarMonth).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    commitParts({ ...parts, year: String(calendarYear), month, day: dayStr })
    setIsCalendarOpen(false)
  }

  function handleCalendarIconClick() {
    if (parts.year && parts.month) {
      setCalendarYear(parseInt(parts.year, 10))
      setCalendarMonth(parseInt(parts.month, 10))
    }
    setIsCalendarOpen((v) => !v)
  }

  function handlePrevMonth() {
    if (calendarMonth === 1) {
      setCalendarMonth(12)
      setCalendarYear((y) => y - 1)
    } else {
      setCalendarMonth((m) => m - 1)
    }
  }

  function handleNextMonth() {
    if (calendarMonth === 12) {
      setCalendarMonth(1)
      setCalendarYear((y) => y + 1)
    } else {
      setCalendarMonth((m) => m + 1)
    }
  }

  // ─── 달력 렌더 ───────────────────────────────────────────────────────────────

  function renderCalendar() {
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth)
    const firstDay = getFirstDayOfWeek(calendarYear, calendarMonth)
    const cells: (number | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)

    const selectedDay =
      parts.year === String(calendarYear) && parts.month === String(calendarMonth).padStart(2, '0')
        ? parseInt(parts.day, 10)
        : null

    const today = new Date()
    const isToday = (d: number) =>
      calendarYear === today.getFullYear() && calendarMonth === today.getMonth() + 1 && d === today.getDate()

    return (
      <div className="absolute top-[calc(100%+4px)] right-0 z-50 w-[280px] rounded-[12px] border border-gray-200 bg-white p-4 shadow-lg">
        {/* 월 네비게이션 */}
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="body-md-medium text-gray-700">
            {calendarYear}년 {calendarMonth}월
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 요일 헤더 */}
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

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => (
            <button
              key={idx}
              type="button"
              disabled={day === null}
              onClick={() => day && handleSelectDate(day)}
              className={cn(
                'caption-md flex h-8 w-full items-center justify-center rounded-full transition-colors',
                day === null && 'invisible',
                day !== null && 'hover:bg-gray-100',
                isToday(day!) && day !== selectedDay && 'text-primary-400 font-bold',
                day === selectedDay && 'bg-primary-400 hover:bg-primary-400 font-bold text-white',
                idx % 7 === 0 && day !== selectedDay && 'text-red-400',
                idx % 7 === 6 && day !== selectedDay && 'text-blue-400'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <div ref={containerRef} className="relative">
        <div
          className={cn(
            'input-default flex h-[48px] w-full items-center rounded-[10px] border px-3 transition-colors',
            'border-gray-200 bg-white',
            'focus-within:border-primary-400',
            error && 'border-error-default bg-error-bg',
            disabled && 'cursor-not-allowed border-gray-200 bg-gray-100'
          )}
        >
          {/* 연도 */}
          <input
            data-field="year"
            ref={(el) => {
              fieldRefs.current.year = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            value={parts.year}
            disabled={disabled}
            onFocus={() => handleNumberFocus('year')}
            onChange={(e) => handleNumberChange('year', e.target.value)}
            onBlur={() => handleNumberBlur('year', 9999, 1000)}
            className="w-[40px] bg-transparent text-center text-sm text-gray-950 outline-none placeholder:text-gray-300 disabled:text-gray-300"
          />
          <span className="text-gray-300">.</span>

          {/* 월 */}
          <input
            data-field="month"
            ref={(el) => {
              fieldRefs.current.month = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            value={parts.month}
            disabled={disabled}
            onFocus={() => handleNumberFocus('month')}
            onChange={(e) => handleNumberChange('month', e.target.value)}
            onBlur={() => handleNumberBlur('month', 12)}
            className="w-[28px] bg-transparent text-center text-sm text-gray-950 outline-none placeholder:text-gray-300 disabled:text-gray-300"
          />
          <span className="text-gray-300">.</span>

          {/* 일 */}
          <input
            data-field="day"
            ref={(el) => {
              fieldRefs.current.day = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="DD"
            value={parts.day}
            disabled={disabled}
            onFocus={() => handleNumberFocus('day')}
            onChange={(e) => handleNumberChange('day', e.target.value)}
            onBlur={() => handleNumberBlur('day', 31)}
            className="w-[28px] bg-transparent text-center text-sm text-gray-950 outline-none placeholder:text-gray-300 disabled:text-gray-300"
          />

          <div className="mx-2 h-4 w-px bg-gray-200" />

          {/* 오전/오후 토글 */}
          <button
            type="button"
            disabled={disabled}
            onClick={handleMeridiemToggle}
            className="hover:text-primary-400 text-sm text-gray-700 disabled:text-gray-300"
          >
            {parts.meridiem === 'AM' ? '오전' : '오후'}
          </button>

          <div className="mx-1" />

          {/* 시 — 12시간제 (1~12, 0 입력 시 blur에서 12로 보정) */}
          <input
            data-field="hour"
            ref={(el) => {
              fieldRefs.current.hour = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="HH"
            value={parts.hour}
            disabled={disabled}
            onFocus={() => handleNumberFocus('hour')}
            onChange={(e) => handleNumberChange('hour', e.target.value)}
            onBlur={() => handleNumberBlur('hour', 12)}
            className="w-[24px] bg-transparent text-center text-sm text-gray-950 outline-none placeholder:text-gray-300 disabled:text-gray-300"
          />
          <span className="text-gray-400">:</span>

          {/* 분 (0~59) */}
          <input
            data-field="minute"
            ref={(el) => {
              fieldRefs.current.minute = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            placeholder="MM"
            value={parts.minute}
            disabled={disabled}
            onFocus={() => handleNumberFocus('minute')}
            onChange={(e) => handleNumberChange('minute', e.target.value)}
            onBlur={() => handleNumberBlur('minute', 59, 0)}
            className="w-[24px] bg-transparent text-center text-sm text-gray-950 outline-none placeholder:text-gray-300 disabled:text-gray-300"
          />

          {/* 달력 아이콘 */}
          <button
            type="button"
            disabled={disabled}
            onClick={handleCalendarIconClick}
            className="hover:text-primary-400 ml-auto text-gray-400 disabled:text-gray-300"
          >
            <CalendarDays size={16} />
          </button>
        </div>

        {isCalendarOpen && renderCalendar()}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
