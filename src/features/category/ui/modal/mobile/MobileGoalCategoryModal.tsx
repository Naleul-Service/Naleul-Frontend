'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGoalCategoryForm } from '@/src/features/category/hooks/useGoalCategoryForm'
import { GoalCategoryFormFields } from '@/src/features/category/ui/modal/field/GoalCategoryFormFields'

interface MobileGoalCategoryModalProps {
  onClose: () => void
}

export function MobileGoalCategoryModal({ onClose }: MobileGoalCategoryModalProps) {
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
    <div className="fixed inset-0 z-50 flex flex-col gap-5 overflow-y-auto bg-white px-4 pb-8">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="목표 추가" />
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
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
        <Button className="w-full" variant="primary" size="lg" onClick={handleSubmit} isLoading={isPending}>
          만들기
        </Button>
      </div>
    </div>
  )
}
