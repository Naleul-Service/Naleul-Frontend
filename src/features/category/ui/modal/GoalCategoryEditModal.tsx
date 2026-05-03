'use client'

import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { DesktopGoalCategoryEditModal } from '@/src/features/category/ui/modal/desktop/DesktopGoalCategoryEditModal'
import { MobileGoalCategoryEditModal } from '@/src/features/category/ui/modal/mobile/MobileGoalCategoryEditModal'

interface GoalCategoryEditModalProps {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

export function GoalCategoryEditModal({ isOpen, onClose, category }: GoalCategoryEditModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopGoalCategoryEditModal isOpen={isOpen} onClose={onClose} category={category} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileGoalCategoryEditModal onClose={onClose} category={category} />
      </div>
    </>
  )
}
