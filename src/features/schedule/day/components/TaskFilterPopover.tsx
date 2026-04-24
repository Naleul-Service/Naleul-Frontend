'use client'

import { useRef, useState } from 'react'
import { FilterIcon } from '@/src/assets/svgComponents'
import { TaskFilterState, TaskPriority } from '@/src/features/task/types'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { TaskFilterBar } from '@/src/features/schedule/day/components/TaskFilterBar'
import { useOnClickOutside } from '@/src/features/schedule/day/hooks/useOnClickOutside'

interface TaskFilterPopoverProps {
  filter: TaskFilterState
  goalCategories: GoalCategory[]
  onPriorityChange: (v: TaskPriority | null) => void
  onGoalCategoryChange: (v: number | null) => void
  onGeneralCategoryChange: (v: number | null) => void
}

export function TaskFilterPopover({
  filter,
  goalCategories,
  onPriorityChange,
  onGoalCategoryChange,
  onGeneralCategoryChange,
}: TaskFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setIsOpen(false))

  const hasActiveFilter =
    filter.priority !== null || filter.goalCategoryId !== null || filter.generalCategoryId !== null

  return (
    <div ref={ref} className="relative">
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'rounded-[8px] border transition-colors',
          hasActiveFilter
            ? 'border-foreground bg-foreground/5' // 필터 적용 중 표시
            : 'border-gray-100',
        ].join(' ')}
        aria-label="필터"
        aria-expanded={isOpen}
      >
        <FilterIcon width={32} height={32} />
      </button>

      {/* 팝오버 패널 */}
      {isOpen && (
        <div className="bg-background border-border absolute top-full left-0 z-50 mt-2 w-80 w-[440px] rounded-xl border p-4 shadow-lg">
          <TaskFilterBar
            filter={filter}
            goalCategories={goalCategories}
            onPriorityChange={onPriorityChange}
            onGoalCategoryChange={onGoalCategoryChange}
            onGeneralCategoryChange={onGeneralCategoryChange}
          />
        </div>
      )}
    </div>
  )
}
