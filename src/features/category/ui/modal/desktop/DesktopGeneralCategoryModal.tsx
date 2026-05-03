'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGeneralCategoryForm } from '@/src/features/category/hooks/useGeneralCategoryForm'
import { GeneralCategoryFormFields } from '@/src/features/category/ui/modal/field/GeneralCategoryFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  goalCategory: GoalCategory
}

export function DesktopGeneralCategoryModal({ isOpen, onClose, goalCategory }: Props) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { name, setName, selectedColorId, setSelectedColorId, error, isPending, handleClose, handleSubmit } =
    useGeneralCategoryForm({ goalCategory, onClose })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="일반 카테고리 추가"
      description={`"${goalCategory.goalCategoryName}" 하위 카테고리를 만들어요`}
      size="md"
      footer={
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button className="w-full" size="lg" onClick={handleSubmit} isLoading={isPending}>
            만들기
          </Button>
        </div>
      }
    >
      <GeneralCategoryFormFields
        name={name}
        onNameChange={setName}
        selectedColorId={selectedColorId}
        onSelectColor={setSelectedColorId}
        colors={colors}
        isColorsLoading={isColorsLoading}
        error={error}
      />
    </Modal>
  )
}
