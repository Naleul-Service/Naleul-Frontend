'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGeneralCategoryEditForm } from '@/src/features/category/hooks/useGeneralCategoryEditForm'
import { GeneralCategoryEditFormFields } from '@/src/features/category/ui/modal/field/GeneralCategoryEditFormFields'

interface Props {
  isOpen: boolean
  onClose: () => void
  item: GeneralCategoryItemType
  goalCategory: GoalCategory
}

export function DesktopGeneralCategoryEditModal({ isOpen, onClose, item, goalCategory }: Props) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { form, nameError, isPending, isValid, handleChange, handleSubmit, handleClose } = useGeneralCategoryEditForm({
    isOpen,
    item,
    goalCategory,
    colors,
    onClose,
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="일반 카테고리 수정"
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
      <GeneralCategoryEditFormFields
        generalCategoryName={form.generalCategoryName}
        onNameChange={(v) => handleChange('generalCategoryName', v)}
        nameError={nameError}
        colorId={form.colorId}
        onSelectColor={(v) => handleChange('colorId', v)}
        colors={colors}
        isColorsLoading={isColorsLoading}
      />
    </Modal>
  )
}
