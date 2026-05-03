import { Input } from '@/src/components/common/Input'
import { DatePicker } from '@/src/components/common/picker/DatePicker'
import Label from '@/src/components/common/Label'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'
import { Color } from '@/src/features/color/types'

interface GoalCategoryFormFieldsProps {
  name: string
  onNameChange: (value: string) => void
  startDate: string
  onStartDateChange: (value: string) => void
  selectedColorId: number | null
  onSelectColor: (colorId: number) => void
  colors: Color[]
  isColorsLoading: boolean
  error: string | null
}

export function GoalCategoryFormFields({
  name,
  onNameChange,
  startDate,
  onStartDateChange,
  selectedColorId,
  onSelectColor,
  colors,
  isColorsLoading,
  error,
}: GoalCategoryFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="카테고리명"
        isRequired
        placeholder="예) 건강, 자기계발, 재테크"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
      />
      <DatePicker label="시작일" isRequired value={startDate} onChange={onStartDateChange} />
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
