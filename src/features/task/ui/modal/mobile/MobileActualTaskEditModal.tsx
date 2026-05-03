'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { TaskActualItem } from '@/src/features/task/types'
import { useActualTaskEditForm } from '@/src/features/task/hooks/useActualTaskEditForm'
import { ActualTaskEditFormFields } from '@/src/features/task/ui/modal/field/ActualTaskEditFormFields'

interface Props {
  actual: TaskActualItem
  onClose: () => void
}

export function MobileActualTaskEditModal({ actual, onClose }: Props) {
  const {
    form,
    errors,
    isPending,
    isLoadingCategories,
    goalOptions,
    generalOptions,
    generalCategories,
    handleChange,
    handleGoalChange,
    handleSubmit,
  } = useActualTaskEditForm({ actual, onClose })

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={onClose} headerType="dynamic" title="실제 기록 수정" />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <ActualTaskEditFormFields
          form={form}
          errors={errors}
          goalOptions={goalOptions}
          generalOptions={generalOptions}
          generalCategories={generalCategories}
          isLoadingCategories={isLoadingCategories}
          onChange={handleChange}
          onGoalChange={handleGoalChange}
        />
        <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
          저장
        </Button>
      </div>
    </div>
  )
}
