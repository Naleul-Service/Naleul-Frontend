'use client'

import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { DesktopGeneralCategoryEditModal } from '@/src/features/category/ui/modal/desktop/DesktopGeneralCategoryEditModal'
import { MobileGeneralCategoryEditModal } from '@/src/features/category/ui/modal/mobile/MobileGeneralCategoryEditModal'

interface GeneralCategoryEditModalProps {
  isOpen: boolean
  onClose: () => void
  item: GeneralCategoryItemType
  goalCategory: GoalCategory
}

export function GeneralCategoryEditModal({ isOpen, onClose, item, goalCategory }: GeneralCategoryEditModalProps) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopGeneralCategoryEditModal isOpen={isOpen} onClose={onClose} item={item} goalCategory={goalCategory} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileGeneralCategoryEditModal onClose={onClose} item={item} goalCategory={goalCategory} />
      </div>
    </>
  )
}
