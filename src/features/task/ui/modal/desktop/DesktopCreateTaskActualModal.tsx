'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { useCreateTaskActualForm } from '@/src/features/task/hooks/useCreateTaskActualForm'
import { CreateTaskActualFormFields } from '@/src/features/task/ui/modal/field/CreateTaskActualFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  date: string
  defaultDate?: string
}

export function DesktopCreateTaskActualModal({ isOpen, onClose, date, defaultDate }: Props) {
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="실제 시간 기록"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      }
    >
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
    </Modal>
  )
}
