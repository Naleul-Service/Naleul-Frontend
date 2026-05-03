'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CalendarIcon, FilterIcon } from '@/src/assets/svgComponents'
import { DayPicker } from '@/src/components/common/picker/DayPicker'
import { getWeekRange, WeekPicker } from '@/src/components/common/picker/WeekPicker'
import { MonthPicker } from '@/src/components/common/picker/MonthPicker'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import type { ReviewType } from '../types'

const REVIEW_TYPE_LABELS: Record<ReviewType | 'ALL', string> = {
  ALL: '전체',
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function shiftDate(dateStr: string, reviewType: ReviewType, direction: number): string {
  const d = new Date(dateStr)
  if (reviewType === 'DAILY') d.setDate(d.getDate() + direction)
  else if (reviewType === 'WEEKLY') d.setDate(d.getDate() + direction * 7)
  else d.setMonth(d.getMonth() + direction)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(dateStr: string, reviewType: ReviewType): string {
  const d = new Date(dateStr)
  if (reviewType === 'DAILY') {
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
  }
  if (reviewType === 'WEEKLY') {
    const { start, end } = getWeekRange(dateStr)
    const fmt = (date: Date) => date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
    return `${fmt(start)} ~ ${fmt(end)}`
  }
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })
}

// ─── Chip ─────────────────────────────────────────────────
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'label-sm flex items-center gap-1 rounded-full px-[10px] py-1 transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'hover:text-foreground border border-gray-100 bg-gray-50 text-gray-500',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

interface Props {
  selectedType: ReviewType | undefined
  onTypeChange: (type: ReviewType | undefined) => void
  baseDate: string
  onDateChange: (date: string) => void
  goalCategoryId: number | undefined
  generalCategoryId: number | undefined
  goalCategories: GoalCategory[]
  onGoalCategoryChange: (id: number | undefined) => void
  onGeneralCategoryChange: (id: number | undefined) => void
}

export function RetrospectiveFilter({
  selectedType,
  onTypeChange,
  baseDate,
  onDateChange,
  goalCategoryId,
  generalCategoryId,
  goalCategories,
  onGoalCategoryChange,
  onGeneralCategoryChange,
}: Props) {
  const [isDateOpen, setIsDateOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const dateRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setIsDateOpen(false)
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setIsFilterOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleTypeChange(type: ReviewType | undefined) {
    onTypeChange(type)
    setIsDateOpen(false)
  }

  function handleDateSelect(date: string) {
    onDateChange(date)
    setIsDateOpen(false)
  }

  const hasActiveFilter = goalCategoryId !== undefined || generalCategoryId !== undefined
  const selectedGoalCategory = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

  return (
    <div className="desktop:flex-row tablet:flex-row desktop:items-center tablet:items-center flex flex-col items-start gap-3">
      {/* 타입 탭 */}
      <nav className="label-md flex w-fit gap-1 rounded-[8px] bg-gray-50 px-[6px] py-[5px] text-gray-300">
        <div className="flex overflow-hidden">
          {(['ALL', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => {
            const value = type === 'ALL' ? undefined : type
            const isActive = selectedType === value
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(value)}
                className={[
                  'flex-1 rounded-md px-4 py-1.5 text-center transition-colors',
                  isActive ? 'bg-white text-gray-950 shadow-sm' : 'bg-gray-50 hover:text-gray-300',
                ].join(' ')}
              >
                {REVIEW_TYPE_LABELS[type]}
              </button>
            )
          })}
        </div>
      </nav>
      <div className="flex items-center justify-center gap-3">
        {/* 날짜 선택 */}
        {selectedType && (
          <div className="flex h-[40px] items-center gap-1 rounded-[8px] border border-gray-100">
            <button
              type="button"
              aria-label="이전"
              disabled={!baseDate}
              onClick={() => baseDate && onDateChange(shiftDate(baseDate, selectedType, -1))}
              className="flex h-full items-center px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <div ref={dateRef} className="relative">
              <button
                type="button"
                onClick={() => setIsDateOpen((v) => !v)}
                className="label-md flex items-center gap-1.5 text-gray-500 transition-colors hover:text-gray-700"
                aria-label="날짜 선택"
              >
                <CalendarIcon width={16} height={16} />
                {baseDate ? formatDateLabel(baseDate, selectedType) : '날짜 선택'}
              </button>

              {isDateOpen && (
                <div className="absolute top-[calc(100%+8px)] left-1/2 z-50 -translate-x-1/2 rounded-[12px] border border-gray-200 bg-white shadow-lg">
                  {selectedType === 'DAILY' && (
                    <DayPicker currentDate={baseDate || today()} onSelect={handleDateSelect} />
                  )}
                  {selectedType === 'WEEKLY' && (
                    <WeekPicker currentDate={baseDate || today()} onSelect={handleDateSelect} />
                  )}
                  {selectedType === 'MONTHLY' && (
                    <MonthPicker currentDate={baseDate || today()} onSelect={handleDateSelect} />
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              aria-label="다음"
              disabled={!baseDate}
              onClick={() => baseDate && onDateChange(shiftDate(baseDate, selectedType, 1))}
              className="flex h-full items-center px-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 카테고리 필터 */}
        <div ref={filterRef} className="relative">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className={[
              'rounded-[8px] border transition-colors',
              hasActiveFilter ? 'border-foreground bg-foreground/5' : 'border-gray-100',
            ].join(' ')}
            aria-label="필터"
            aria-expanded={isFilterOpen}
          >
            <FilterIcon width={32} height={32} />
          </button>

          {isFilterOpen && (
            <div className="bg-background absolute top-full left-0 z-50 mt-2 w-[440px] rounded-[12px] border border-gray-200 p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <span className="body-md-medium w-20 shrink-0 text-gray-300">목표</span>
                  <div className="flex flex-wrap gap-1.5">
                    <Chip active={goalCategoryId === undefined} onClick={() => onGoalCategoryChange(undefined)}>
                      전체
                    </Chip>
                    {goalCategories.map((g) => (
                      <Chip
                        key={g.goalCategoryId}
                        active={goalCategoryId === g.goalCategoryId}
                        onClick={() => onGoalCategoryChange(g.goalCategoryId)}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode ?? '#637580' }} />
                        {g.goalCategoryName}
                      </Chip>
                    ))}
                  </div>
                </div>

                {selectedGoalCategory && (
                  <div className="flex items-start gap-2">
                    <span className="body-md-medium w-20 shrink-0 text-gray-300">카테고리</span>
                    <div className="flex flex-wrap gap-1.5">
                      <Chip active={generalCategoryId === undefined} onClick={() => onGeneralCategoryChange(undefined)}>
                        전체
                      </Chip>
                      {generalCategories.map((g) => (
                        <Chip
                          key={g.generalCategoryId}
                          active={generalCategoryId === g.generalCategoryId}
                          onClick={() => onGeneralCategoryChange(g.generalCategoryId)}
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: g.colorCode ?? '#637580' }}
                          />
                          {g.generalCategoryName}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
