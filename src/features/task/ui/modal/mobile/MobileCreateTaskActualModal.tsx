'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { useCreateTaskActualForm } from '@/src/features/task/hooks/useCreateTaskActualForm'
import { CreateTaskActualFormFields } from '@/src/features/task/ui/modal/field/CreateTaskActualFormFields'

interface Props {
  onClose: () => void
  date: string
  defaultDate?: string
}

export function MobileCreateTaskActualModal({ onClose, date, defaultDate }: Props) {
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
  } = useCreateTaskActualForm({ date, defaultDate, onClose })

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="실제 시간 기록" />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <CreateTaskActualFormFields
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
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}
