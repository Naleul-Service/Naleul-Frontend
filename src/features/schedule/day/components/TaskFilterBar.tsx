'use client'

import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { TaskFilterState } from '../types'
import { TaskPriority } from '@/src/features/task/types'

const PRIORITIES: TaskPriority[] = ['A', 'B', 'C', 'D', 'E']

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  A: 'bg-red-500',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-green-500',
  E: 'bg-blue-500',
}

interface TaskFilterBarProps {
  filter: TaskFilterState
  goalCategories: GoalCategory[]
  onPriorityChange: (v: TaskPriority | null) => void
  onGoalCategoryChange: (v: number | null) => void
  onGeneralCategoryChange: (v: number | null) => void
}

export function TaskFilterBar({
  filter,
  goalCategories,
  onPriorityChange,
  onGoalCategoryChange,
  onGeneralCategoryChange,
}: TaskFilterBarProps) {
  const selectedGoal = goalCategories.find((g) => g.goalCategoryId === filter.goalCategoryId)
  const generalCategories = selectedGoal?.generalCategories ?? []

  return (
    <div className="flex flex-col gap-3">
      {/* 우선순위 */}
      <FilterRow label="우선순위">
        <Chip active={filter.priority === null} onClick={() => onPriorityChange(null)}>
          전체
        </Chip>
        {PRIORITIES.map((p) => (
          <Chip key={p} active={filter.priority === p} onClick={() => onPriorityChange(p)}>
            <span className={`h-2 w-2 rounded-full ${PRIORITY_COLOR[p]}`} />
            {p}
          </Chip>
        ))}
      </FilterRow>

      {/* 목표 카테고리 */}
      <FilterRow label="목표 카테고리">
        <Chip active={filter.goalCategoryId === null} onClick={() => onGoalCategoryChange(null)}>
          전체
        </Chip>
        {goalCategories.map((g) => (
          <Chip
            key={g.goalCategoryId}
            active={filter.goalCategoryId === g.goalCategoryId}
            onClick={() => onGoalCategoryChange(g.goalCategoryId)}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode }} />
            {g.goalCategoryName}
          </Chip>
        ))}
      </FilterRow>

      {/* 일반 카테고리 — 목표 카테고리 선택 시만 노출 */}
      {selectedGoal && (
        <FilterRow label="일반 카테고리">
          <Chip active={filter.generalCategoryId === null} onClick={() => onGeneralCategoryChange(null)}>
            전체
          </Chip>
          {generalCategories.map((g) => (
            <Chip
              key={g.generalCategoryId}
              active={filter.generalCategoryId === g.generalCategoryId}
              onClick={() => onGeneralCategoryChange(g.generalCategoryId)}
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode }} />
              {g.generalCategoryName}
            </Chip>
          ))}
        </FilterRow>
      )}
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-20 shrink-0 text-xs">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors',
        active ? 'bg-foreground text-background' : 'border-border text-muted-foreground hover:text-foreground border',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
