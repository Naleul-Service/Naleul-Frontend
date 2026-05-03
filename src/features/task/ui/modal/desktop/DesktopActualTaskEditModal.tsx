'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { TaskActualItem } from '@/src/features/task/types'
import { useActualTaskEditForm } from '@/src/features/task/hooks/useActualTaskEditForm'
import { ActualTaskEditFormFields } from '@/src/features/task/ui/modal/field/ActualTaskEditFormFields'

interface Props {
  actual: TaskActualItem
  onClose: () => void
}

export function DesktopActualTaskEditModal({ actual, onClose }: Props) {
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
    <Modal
      isOpen
      onClose={onClose}
      title="실제 기록 수정"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      }
    >
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
    </Modal>
  )
}
