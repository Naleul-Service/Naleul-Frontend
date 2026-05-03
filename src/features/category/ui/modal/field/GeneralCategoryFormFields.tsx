import { Input } from '@/src/components/common/Input'
import Label from '@/src/components/common/Label'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'
import { Color } from '@/src/features/color/types'

interface GeneralCategoryFormFieldsProps {
  name: string
  onNameChange: (value: string) => void
  selectedColorId: number | null
  onSelectColor: (colorId: number) => void
  colors: Color[]
  isColorsLoading: boolean
  error: string | null
}

export function GeneralCategoryFormFields({
  name,
  onNameChange,
  selectedColorId,
  onSelectColor,
  colors,
  isColorsLoading,
  error,
}: GeneralCategoryFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="카테고리 이름"
        isRequired
        placeholder="예) 헬스, 독서, 저축"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <div className="flex flex-col gap-2">
        <Label isRequired>색상</Label>
        <ColorPicker
          colors={colors}
          isLoading={isColorsLoading}
          selectedColorId={selectedColorId}
          onSelect={onSelectColor}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
