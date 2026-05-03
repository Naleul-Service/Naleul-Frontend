'use client'

import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import type { RetrospectiveResponse } from '../../types'
import { RetrospectiveCreateModal } from './RetrospectiveCreateModal'
import { RetrospectiveEditModal } from './RetrospectiveEditModal'

type ModalState = { type: 'closed' } | { type: 'create' } | { type: 'edit'; data: RetrospectiveResponse }

interface Props {
  modal: ModalState
  onClose: () => void
  goalCategories: GoalCategory[]
}

export function RetrospectiveModal({ modal, onClose, goalCategories }: Props) {
  if (modal.type === 'closed') return null

  return (
    <>
      {modal.type === 'create' && <RetrospectiveCreateModal isOpen onClose={onClose} goalCategories={goalCategories} />}
      {modal.type === 'edit' && (
        <RetrospectiveEditModal isOpen onClose={onClose} data={modal.data} goalCategories={goalCategories} />
      )}
    </>
  )
}
