import { useCallback, useState } from 'react'
import { INITIAL_FILTER, TaskFilterState } from '../types'
import { TaskPriority } from '@/src/features/task/types'

export function useTaskFilter() {
  const [filter, setFilter] = useState<TaskFilterState>(INITIAL_FILTER)

  const setPriority = useCallback((priority: TaskPriority | null) => {
    setFilter((prev) => ({ ...prev, priority }))
  }, [])

  const setGoalCategory = useCallback((goalCategoryId: number | null) => {
    setFilter((prev) => ({ ...prev, goalCategoryId, generalCategoryId: null }))
    // 목표 카테고리 바꾸면 일반 카테고리 초기화 — UX 고려
  }, [])

  const setGeneralCategory = useCallback((generalCategoryId: number | null) => {
    setFilter((prev) => ({ ...prev, generalCategoryId }))
  }, [])

  const reset = useCallback(() => setFilter(INITIAL_FILTER), [])

  const isActive = Object.values(filter).some(Boolean)

  return { filter, setPriority, setGoalCategory, setGeneralCategory, reset, isActive }
}
