'use client'

import { useEffect, useRef, useState } from 'react'
import { FilterIcon } from '@/src/assets/svgComponents'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'

interface RetrospectiveFilterPopoverProps {
  goalCategoryId: number | undefined
  generalCategoryId: number | undefined
  goalCategories: GoalCategory[]
  onGoalCategoryChange: (id: number | undefined) => void
  onGeneralCategoryChange: (id: number | undefined) => void
}

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

export function RetrospectiveFilterPopover({
  goalCategoryId,
  generalCategoryId,
  goalCategories,
  onGoalCategoryChange,
  onGeneralCategoryChange,
}: RetrospectiveFilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const hasActiveFilter = goalCategoryId !== undefined || generalCategoryId !== undefined
  const selectedGoalCategory = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'rounded-[8px] border transition-colors',
          hasActiveFilter ? 'border-foreground bg-foreground/5' : 'border-gray-100',
        ].join(' ')}
        aria-label="필터"
        aria-expanded={isOpen}
      >
        <FilterIcon width={32} height={32} />
      </button>

      {isOpen && (
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
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode ?? '#637580' }} />
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
  )
}
