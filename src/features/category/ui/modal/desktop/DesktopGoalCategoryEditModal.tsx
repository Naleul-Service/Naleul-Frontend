'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGoalCategoryEditForm } from '@/src/features/category/hooks/useGoalCategoryEditForm'
import { GoalCategoryEditFormFields } from '@/src/features/category/ui/modal/field/GoalCategoryEditFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

export function DesktopGoalCategoryEditModal({ isOpen, onClose, category }: Props) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { form, nameError, isPending, isValid, handleChange, handleSubmit, handleClose } = useGoalCategoryEditForm({
    isOpen,
    category,
    colors,
    onClose,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 카테고리 수정"
      footer={
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button className="w-full" size="lg" onClick={handleSubmit} isLoading={isPending} disabled={!isValid}>
            저장하기
          </Button>
        </div>
      }
    >
      <GoalCategoryEditFormFields
        goalCategoryName={form.goalCategoryName}
        onNameChange={(v) => handleChange('goalCategoryName', v)}
        nameError={nameError}
        goalCategoryStatus={form.goalCategoryStatus}
        onStatusChange={(v) => handleChange('goalCategoryStatus', v)}
        goalCategoryStartDate={form.goalCategoryStartDate}
        onStartDateChange={(v) => handleChange('goalCategoryStartDate', v)}
        colorId={form.colorId}
        onSelectColor={(v) => handleChange('colorId', v)}
        colors={colors}
        isColorsLoading={isColorsLoading}
      />
    </Modal>
  )
}
