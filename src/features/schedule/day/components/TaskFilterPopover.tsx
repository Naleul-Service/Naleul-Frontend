'use client'

import { useEffect, useRef, useState } from 'react'
import { FilterIcon } from '@/src/assets/svgComponents'
import { TaskFilterState, TaskPriority } from '@/src/features/task/types'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { TaskFilterBar } from '@/src/features/schedule/day/components/TaskFilterBar'
import { useOnClickOutside } from '@/src/features/schedule/day/hooks/useOnClickOutside'
import { cn } from '@/src/lib/utils'

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
  const [alignRight, setAlignRight] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(ref, () => setIsOpen(false))

  // 팝오버가 열릴 때 화면 밖으로 나가는지 체크
  useEffect(() => {
    if (!isOpen || !panelRef.current) return

    const rect = panelRef.current.getBoundingClientRect()
    if (rect.right > window.innerWidth) {
      setAlignRight(true)
    } else {
      setAlignRight(false)
    }
  }, [isOpen])

  const hasActiveFilter =
    filter.priority !== null || filter.goalCategoryId !== null || filter.generalCategoryId !== null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'rounded-[8px] border transition-colors',
          hasActiveFilter ? 'border-foreground bg-foreground/5' : 'border-gray-100'
        )}
        aria-label="필터"
        aria-expanded={isOpen}
      >
        <FilterIcon width={32} height={32} />
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className={cn(
            'bg-background absolute top-full z-50 mt-2 rounded-[12px] border border-gray-200',
            // 모바일: 화면 너비에 맞게 / 태블릿 이상: 고정 너비
            'tablet:w-[440px] tablet:p-4 w-[calc(100vw-32px)] p-3',
            alignRight ? 'right-0' : 'left-0'
          )}
        >
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
