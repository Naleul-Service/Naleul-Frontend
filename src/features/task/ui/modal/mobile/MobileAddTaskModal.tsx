'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { useAddTaskForm } from '@/src/features/task/hooks/useAddTaskForm'
import { AddTaskFormFields } from '@/src/features/task/ui/modal/field/AddTaskFormFields'

interface Props {
  onClose: () => void
  defaultDate?: string
}

export function MobileAddTaskModal({ onClose, defaultDate }: Props) {
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
    handleClose,
    handleSubmit,
  } = useAddTaskForm({ defaultDate, onClose })

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="할 일 추가" />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <AddTaskFormFields
          form={form}
          errors={errors}
          goalOptions={goalOptions}
          generalOptions={generalOptions}
          generalCategories={generalCategories}
          isLoadingCategories={isLoadingCategories}
          onChange={handleChange}
          onGoalChange={handleGoalChange}
        />
        <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            추가
          </Button>
        </div>
      </div>
    </div>
  )
}
