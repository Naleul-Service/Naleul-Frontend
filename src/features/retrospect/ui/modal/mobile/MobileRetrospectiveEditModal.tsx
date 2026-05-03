'use client'

import MobileHeader from '@/src/components/layout/MobileHeader'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import { RetrospectiveForm } from '@/src/features/retrospect/ui/RetrospectiveForm'
import { RetrospectiveResponse } from '@/src/features/retrospect/types'
import { useUpdateRetrospective } from '@/src/features/retrospect/hooks/useRetrospectiveMutations'

interface Props {
  onClose: () => void
  data: RetrospectiveResponse
  goalCategories: GoalCategory[]
}

export function MobileRetrospectiveEditModal({ onClose, data, goalCategories }: Props) {
  const { mutate, isPending } = useUpdateRetrospective(data.retrospectiveId)

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-5 overflow-y-auto bg-white pb-8">
      <MobileHeader onClick={onClose} headerType="dynamic" title="회고 수정" />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <RetrospectiveForm
          mode="edit"
          initialData={data}
          goalCategories={goalCategories}
          isLoading={isPending}
          onSubmit={(body) => mutate(body, { onSuccess: onClose })}
          onCancel={onClose}
        />
      </div>
    </div>
  )
}
