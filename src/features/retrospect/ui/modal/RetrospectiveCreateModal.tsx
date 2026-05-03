'use client'

import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import { MobileRetrospectiveCreateModal } from '@/src/features/retrospect/ui/modal/mobile/MobileRetrospectiveCreateModal'
import { DesktopRetrospectiveCreateModal } from '@/src/features/retrospect/ui/modal/desktop/DesktopRetrospectiveCreateModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  goalCategories: GoalCategory[]
}

export function RetrospectiveCreateModal({ isOpen, onClose, goalCategories }: Props) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopRetrospectiveCreateModal isOpen={isOpen} onClose={onClose} goalCategories={goalCategories} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileRetrospectiveCreateModal onClose={onClose} goalCategories={goalCategories} />
      </div>
    </>
  )
}
