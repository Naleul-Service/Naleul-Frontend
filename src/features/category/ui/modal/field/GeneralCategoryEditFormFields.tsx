import { Input } from '@/src/components/common/Input'
import Label from '@/src/components/common/Label'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'
import { Color } from '@/src/features/color/types'

interface GeneralCategoryEditFormFieldsProps {
  generalCategoryName: string
  onNameChange: (value: string) => void
  nameError: string
  colorId: number | null
  onSelectColor: (colorId: number) => void
  colors: Color[]
  isColorsLoading: boolean
}

export function GeneralCategoryEditFormFields({
  generalCategoryName,
  onNameChange,
  nameError,
  colorId,
  onSelectColor,
  colors,
  isColorsLoading,
}: GeneralCategoryEditFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="카테고리 이름"
        isRequired
        value={generalCategoryName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="일반 카테고리 이름"
        error={nameError}
        maxLength={20}
      />
      <div className="flex flex-col gap-1.5">
        <Label isRequired>색상</Label>
        <ColorPicker colors={colors} isLoading={isColorsLoading} selectedColorId={colorId} onSelect={onSelectColor} />
      </div>
    </div>
  )
}
