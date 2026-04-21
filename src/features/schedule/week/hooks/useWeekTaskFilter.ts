import { useState } from 'react'
import { INITIAL_FILTER, TaskFilterState, TaskPriority } from '@/src/features/task/types'

interface WeekTaskFilterReturn {
  filter: TaskFilterState
  dayOfWeek: string | undefined
  setPriority: (v: TaskPriority | null) => void
  setGoalCategory: (v: number | null) => void
  setGeneralCategory: (v: number | null) => void
  setDayOfWeek: (v: string | undefined) => void
}

export function useWeekTaskFilter(): WeekTaskFilterReturn {
  const [filter, setFilter] = useState<TaskFilterState>(INITIAL_FILTER)
  const [dayOfWeek, setDayOfWeekState] = useState<string | undefined>()

  return {
    filter,
    dayOfWeek,
    setPriority: (priority) => setFilter((f) => ({ ...f, priority })),
    setGoalCategory: (goalCategoryId) => setFilter((f) => ({ ...f, goalCategoryId, generalCategoryId: null })),
    setGeneralCategory: (generalCategoryId) => setFilter((f) => ({ ...f, generalCategoryId })),
    setDayOfWeek: (day) => setDayOfWeekState(day),
  }
}
