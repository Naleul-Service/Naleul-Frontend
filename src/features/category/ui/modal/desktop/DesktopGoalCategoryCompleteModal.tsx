'use client'

import { CheckCircle } from 'lucide-react'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useGoalCategoryCompleteForm } from '@/src/features/category/hooks/useGoalCategoryCompleteForm'
import { GoalCategoryCompleteFormFields } from '@/src/features/category/ui/modal/field/GoalCategoryCompleteFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

export function DesktopGoalCategoryCompleteModal({ isOpen, onClose, category }: Props) {
  const { form, errors, isPending, isValid, handleChange, handleSubmit, handleClose } = useGoalCategoryCompleteForm({
    isOpen,
    category,
    onClose,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 완료"
      footer={
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
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
      }
    >
      <GoalCategoryCompleteFormFields
        category={category}
        goalCategoryEndDate={form.goalCategoryEndDate}
        onEndDateChange={(v) => handleChange('goalCategoryEndDate', v)}
        achievement={form.achievement}
        onAchievementChange={(v) => handleChange('achievement', v)}
        achievementError={errors.achievement}
      />
    </Modal>
  )
}
