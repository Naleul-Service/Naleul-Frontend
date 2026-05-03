'use client'

import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { DesktopGeneralCategoryModal } from '@/src/features/category/ui/modal/desktop/DesktopGeneralCategoryModal'
import { MobileGeneralCategoryModal } from '@/src/features/category/ui/modal/mobile/MobileGeneralCategoryModal'

interface GeneralCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  goalCategory: GoalCategory
}

export function GeneralCategoryModal({ isOpen, onClose, goalCategory }: GeneralCategoryModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopGeneralCategoryModal isOpen={isOpen} onClose={onClose} goalCategory={goalCategory} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileGeneralCategoryModal onClose={onClose} goalCategory={goalCategory} />
      </div>
    </>
  )
}
