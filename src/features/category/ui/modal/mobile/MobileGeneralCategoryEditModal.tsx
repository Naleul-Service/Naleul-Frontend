'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGeneralCategoryEditForm } from '@/src/features/category/hooks/useGeneralCategoryEditForm'
import { GeneralCategoryEditFormFields } from '@/src/features/category/ui/modal/field/GeneralCategoryEditFormFields'

interface Props {
  onClose: () => void
  item: GeneralCategoryItemType
  goalCategory: GoalCategory
}

export function MobileGeneralCategoryEditModal({ onClose, item, goalCategory }: Props) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { form, nameError, isPending, isValid, handleChange, handleSubmit, handleClose } = useGeneralCategoryEditForm({
    isOpen: true,
    item,
    goalCategory,
    colors,
    onClose,
  })

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-5 overflow-y-auto bg-white px-4 pb-8">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="일반 카테고리 수정" />
      <GeneralCategoryEditFormFields
        generalCategoryName={form.generalCategoryName}
        onNameChange={(v) => handleChange('generalCategoryName', v)}
        nameError={nameError}
        colorId={form.colorId}
        onSelectColor={(v) => handleChange('colorId', v)}
        colors={colors}
        isColorsLoading={isColorsLoading}
      />
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
        <Button
          className="w-full"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          isLoading={isPending}
          disabled={!isValid}
        >
          저장하기
        </Button>
      </div>
    </div>
  )
}
