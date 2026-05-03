'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useColors } from '@/src/features/color/hooks/useColors'
import { useGeneralCategoryForm } from '@/src/features/category/hooks/useGeneralCategoryForm'
import { GeneralCategoryFormFields } from '@/src/features/category/ui/modal/field/GeneralCategoryFormFields'

interface Props {
  onClose: () => void
  goalCategory: GoalCategory
}

export function MobileGeneralCategoryModal({ onClose, goalCategory }: Props) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { name, setName, selectedColorId, setSelectedColorId, error, isPending, handleClose, handleSubmit } =
    useGeneralCategoryForm({ goalCategory, onClose })

  return (
    <div className="fixed inset-0 z-50 flex flex-col gap-5 overflow-y-auto bg-white px-4 pb-8">
      <MobileHeader onClick={handleClose} headerType="dynamic" title="일반 카테고리 추가" />
      <GeneralCategoryFormFields
        name={name}
        onNameChange={setName}
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
