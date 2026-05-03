'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGoalCategoryForm } from '@/src/features/category/hooks/useGoalCategoryForm'
import { GoalCategoryFormFields } from '@/src/features/category/ui/modal/field/GoalCategoryFormFields'

interface DesktopGoalCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DesktopGoalCategoryModal({ isOpen, onClose }: DesktopGoalCategoryModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const {
    name,
    setName,
    selectedColorId,
    setSelectedColorId,
    startDate,
    setStartDate,
    error,
    isPending,
    handleClose,
    handleSubmit,
  } = useGoalCategoryForm(onClose)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 카테고리 추가"
      description="목표를 담을 카테고리를 만들어요"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button className="w-full" variant="primary" size="lg" onClick={handleSubmit} isLoading={isPending}>
            만들기
          </Button>
        </div>
      }
    >
      <GoalCategoryFormFields
        name={name}
        onNameChange={setName}
        startDate={startDate}
        onStartDateChange={setStartDate}
        selectedColorId={selectedColorId}
        onSelectColor={setSelectedColorId}
        colors={colors}
        isColorsLoading={isColorsLoading}
        error={error}
      />
    </Modal>
  )
}
