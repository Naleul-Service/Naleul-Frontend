// ScheduleHeaderContext.tsx

'use client'

import { createContext, ReactNode, useContext, useState } from 'react'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { TaskFilterState, TaskPriority } from '@/src/features/task/types'
import { GoalCategory } from '@/src/features/category/api/goalCategory'

export type MobileTab = 'schedule' | 'timeline'

interface ScheduleHeaderContextValue {
  // filter
  filter: TaskFilterState
  goalCategories: GoalCategory[]
  setPriority: (v: TaskPriority | null) => void
  setGoalCategory: (v: number | null) => void
  setGeneralCategory: (v: number | null) => void
  dayOfWeek: string | null // 추가
  setDayOfWeek: (v: string | null) => void // 추가 (필요하면)
  // modal
  openAddTask: () => void
  openAddTaskActual: () => void
  isAddTaskOpen: boolean
  isAddTaskActualOpen: boolean
  closeAddTask: () => void
  closeAddTaskActual: () => void
  // 모바일 탭
  mobileTab: MobileTab
  setMobileTab: (tab: MobileTab) => void
}

const ScheduleHeaderContext = createContext<ScheduleHeaderContextValue | null>(null)

export function ScheduleHeaderProvider({ children }: { children: ReactNode }) {
  const { filter, setPriority, setGoalCategory, setGeneralCategory, dayOfWeek, setDayOfWeek } = useTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isAddTaskActualOpen, setIsAddTaskActualOpen] = useState(false)
  const [mobileTab, setMobileTab] = useState<MobileTab>('schedule')

  const normalizedDayOfWeek = dayOfWeek ?? null
  const handleSetDayOfWeek = (v: string | null) => setDayOfWeek(v ?? undefined)

  return (
    <ScheduleHeaderContext.Provider
      value={{
        filter,
        goalCategories,
        setPriority,
        setGoalCategory,
        setGeneralCategory,
        dayOfWeek: normalizedDayOfWeek,
        setDayOfWeek: handleSetDayOfWeek,
        openAddTask: () => setIsAddTaskOpen(true),
        openAddTaskActual: () => setIsAddTaskActualOpen(true),
        isAddTaskOpen,
        isAddTaskActualOpen,
        closeAddTask: () => setIsAddTaskOpen(false),
        closeAddTaskActual: () => setIsAddTaskActualOpen(false),
        mobileTab,
        setMobileTab,
      }}
    >
      {children}
    </ScheduleHeaderContext.Provider>
  )
}

export function useScheduleHeader() {
  const ctx = useContext(ScheduleHeaderContext)
  if (!ctx) throw new Error('useScheduleHeader must be used within ScheduleHeaderProvider')
  return ctx
}
