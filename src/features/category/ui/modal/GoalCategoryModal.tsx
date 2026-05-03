'use client'

import { MobileGoalCategoryModal } from '@/src/features/category/ui/modal/mobile/MobileGoalCategoryModal'
import { DesktopGoalCategoryModal } from '@/src/features/category/ui/modal/desktop/DesktopGoalCategoryModal'

interface GoalCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GoalCategoryModal({ isOpen, onClose }: GoalCategoryModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopGoalCategoryModal isOpen={isOpen} onClose={onClose} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileGoalCategoryModal onClose={onClose} />
      </div>
    </>
  )
}
