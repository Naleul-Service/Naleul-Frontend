'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { useAddTaskForm } from '@/src/features/task/hooks/useAddTaskForm'
import { AddTaskFormFields } from '@/src/features/task/ui/modal/field/AddTaskFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultDate?: string
}

export function DesktopAddTaskModal({ isOpen, onClose, defaultDate }: Props) {
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
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="할 일 추가"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            추가
          </Button>
        </div>
      }
    >
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
    </Modal>
  )
}
