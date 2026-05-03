'use client'

import { Modal } from '@/src/components/common/Modal'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import { RetrospectiveResponse } from '@/src/features/retrospect/types'
import { useUpdateRetrospective } from '@/src/features/retrospect/hooks/useRetrospectiveMutations'
import { RetrospectiveForm } from '@/src/features/retrospect/ui/RetrospectiveForm'

interface Props {
  isOpen: boolean
  onClose: () => void
  data: RetrospectiveResponse
  goalCategories: GoalCategory[]
}

export function DesktopRetrospectiveEditModal({ isOpen, onClose, data, goalCategories }: Props) {
  const { mutate, isPending } = useUpdateRetrospective(data.retrospectiveId)

  return (
    <Modal isOpen={isOpen} title="회고 수정" onClose={onClose}>
      <RetrospectiveForm
        mode="edit"
        initialData={data}
        goalCategories={goalCategories}
        isLoading={isPending}
        onSubmit={(body) => mutate(body, { onSuccess: onClose })}
        onCancel={onClose}
      />
    </Modal>
  )
}
