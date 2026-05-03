'use client'

import MobileHeader from '@/src/components/layout/MobileHeader'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useCreateRetrospective } from '@/src/features/retrospect/hooks/useRetrospectiveMutations'
import { RetrospectiveForm } from '@/src/features/retrospect/ui/RetrospectiveForm'

interface Props {
  onClose: () => void
  goalCategories: GoalCategory[]
}

export function MobileRetrospectiveCreateModal({ onClose, goalCategories }: Props) {
  const { mutate, isPending } = useCreateRetrospective()

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={onClose} headerType="dynamic" title="회고 작성" />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <RetrospectiveForm
          mode="create"
          goalCategories={goalCategories}
          isLoading={isPending}
          onSubmit={(data) => mutate(data, { onSuccess: onClose })}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
