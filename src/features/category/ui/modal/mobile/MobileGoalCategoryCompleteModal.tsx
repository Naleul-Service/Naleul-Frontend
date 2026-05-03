'use client'

import { CheckCircle } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useGoalCategoryCompleteForm } from '@/src/features/category/hooks/useGoalCategoryCompleteForm'
import { GoalCategoryCompleteFormFields } from '@/src/features/category/ui/modal/field/GoalCategoryCompleteFormFields'

interface Props {
  onClose: () => void
  category: GoalCategory
}

export function MobileGoalCategoryCompleteModal({ onClose, category }: Props) {
  const { form, errors, isPending, isValid, handleChange, handleSubmit, handleClose } = useGoalCategoryCompleteForm({
    isOpen: true,
    category,
    onClose,
  })

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-5 overflow-y-auto bg-white px-4 pb-8">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="목표 완료" />
      <GoalCategoryCompleteFormFields
        category={category}
        goalCategoryEndDate={form.goalCategoryEndDate}
        onEndDateChange={(v) => handleChange('goalCategoryEndDate', v)}
        achievement={form.achievement}
        onAchievementChange={(v) => handleChange('achievement', v)}
        achievementError={errors.achievement}
      />
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
        <Button
          className="w-full"
          size="lg"
          onClick={handleSubmit}
          isLoading={isPending}
          disabled={!isValid}
          leftIcon={<CheckCircle size={13} />}
        >
          완료 처리
        </Button>
      </div>
    </div>
  )
}
