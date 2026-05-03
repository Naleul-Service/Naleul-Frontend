import { useState } from 'react'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'

type GoalModalType = 'addGeneral' | 'editGoal' | 'complete' | null

interface GoalModalState {
  type: GoalModalType
  category: GoalCategory | null
}

interface GeneralModalState {
  item: GeneralCategoryItemType | null
  goalCategory: GoalCategory | null
}

export function useGoalCategoryModals() {
  const [goalModal, setGoalModal] = useState<GoalModalState>({ type: null, category: null })
  const [generalEditModal, setGeneralEditModal] = useState<GeneralModalState>({ item: null, goalCategory: null })

  const openGoalModal = (type: GoalModalType, category: GoalCategory) => setGoalModal({ type, category })
  const closeGoalModal = () => setGoalModal({ type: null, category: null })

  const openGeneralEditModal = (item: GeneralCategoryItemType, goalCategory: GoalCategory) =>
    setGeneralEditModal({ item, goalCategory })
  const closeGeneralEditModal = () => setGeneralEditModal({ item: null, goalCategory: null })

  return {
    goalModal,
    openGoalModal,
    closeGoalModal,
    generalEditModal,
    openGeneralEditModal,
    closeGeneralEditModal,
  }
}
