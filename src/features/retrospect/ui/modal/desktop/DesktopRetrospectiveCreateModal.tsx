'use client'

import { Modal } from '@/src/components/common/Modal'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useCreateRetrospective } from '@/src/features/retrospect/hooks/useRetrospectiveMutations'
import { RetrospectiveForm } from '@/src/features/retrospect/ui/RetrospectiveForm'

interface Props {
  isOpen: boolean
  onClose: () => void
  goalCategories: GoalCategory[]
}

export function DesktopRetrospectiveCreateModal({ isOpen, onClose, goalCategories }: Props) {
  const { mutate, isPending } = useCreateRetrospective()

  return (
    <Modal isOpen={isOpen} title="회고 작성" onClose={onClose}>
      <RetrospectiveForm
        mode="create"
        goalCategories={goalCategories}
        isLoading={isPending}
        onSubmit={(data) => mutate(data, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
