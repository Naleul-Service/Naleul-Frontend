// src/features/schedule/day/hooks/useTaskFilter.ts
import { create } from 'zustand'
import { INITIAL_FILTER, TaskFilterState, TaskPriority } from '@/src/features/task/types'

interface TaskFilterStore {
  filter: TaskFilterState
  setPriority: (priority: TaskPriority | null) => void
  setGoalCategory: (goalCategoryId: number | null) => void
  setGeneralCategory: (generalCategoryId: number | null) => void
  reset: () => void
  isActive: boolean
}

export const useTaskFilter = create<TaskFilterStore>((set, get) => ({
  filter: INITIAL_FILTER,

  setPriority: (priority) => set((state) => ({ filter: { ...state.filter, priority } })),

  setGoalCategory: (goalCategoryId) =>
    set((state) => ({
      filter: { ...state.filter, goalCategoryId, generalCategoryId: null },
    })),

  setGeneralCategory: (generalCategoryId) => set((state) => ({ filter: { ...state.filter, generalCategoryId } })),

  reset: () => set({ filter: INITIAL_FILTER }),

  get isActive() {
    return Object.values(get().filter).some(Boolean)
  },
}))
