'use client'

import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import type { RetrospectiveResponse } from '../../types'
import { DesktopRetrospectiveEditModal } from '@/src/features/retrospect/ui/modal/desktop/DesktopRetrospectiveEditModal'
import { MobileRetrospectiveEditModal } from '@/src/features/retrospect/ui/modal/mobile/MobileRetrospectiveEditModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  data: RetrospectiveResponse
  goalCategories: GoalCategory[]
}

export function RetrospectiveEditModal({ isOpen, onClose, data, goalCategories }: Props) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopRetrospectiveEditModal isOpen={isOpen} onClose={onClose} data={data} goalCategories={goalCategories} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileRetrospectiveEditModal onClose={onClose} data={data} goalCategories={goalCategories} />
      </div>
    </>
  )
}
