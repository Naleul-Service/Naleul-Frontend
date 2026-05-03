'use client'

import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { DesktopGoalCategoryCompleteModal } from '@/src/features/category/ui/modal/desktop/DesktopGoalCategoryCompleteModal'
import { MobileGoalCategoryCompleteModal } from '@/src/features/category/ui/modal/mobile/MobileGoalCategoryCompleteModal'

interface GoalCategoryCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

export function GoalCategoryCompleteModal({ isOpen, onClose, category }: GoalCategoryCompleteModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopGoalCategoryCompleteModal isOpen={isOpen} onClose={onClose} category={category} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileGoalCategoryCompleteModal onClose={onClose} category={category} />
      </div>
    </>
  )
}
