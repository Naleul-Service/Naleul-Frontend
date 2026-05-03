import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import Label from '@/src/components/common/Label'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'
import { GoalCategoryStatus } from '@/src/features/category/api/goalCategory'
import { STATUS_OPTIONS } from '@/src/features/category/constants'
import { Color } from '@/src/features/color/types'

interface GoalCategoryEditFormFieldsProps {
  goalCategoryName: string
  onNameChange: (value: string) => void
  nameError: string
  goalCategoryStatus: GoalCategoryStatus
  onStatusChange: (value: GoalCategoryStatus) => void
  goalCategoryStartDate: string
  onStartDateChange: (value: string) => void
  colorId: number | null
  onSelectColor: (colorId: number) => void
  colors: Color[]
  isColorsLoading: boolean
}

export function GoalCategoryEditFormFields({
  goalCategoryName,
  onNameChange,
  nameError,
  goalCategoryStatus,
  onStatusChange,
  goalCategoryStartDate,
  onStartDateChange,
  colorId,
  onSelectColor,
  colors,
  isColorsLoading,
}: GoalCategoryEditFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="목표 이름"
        isRequired
        value={goalCategoryName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="목표 카테고리 이름"
        error={nameError}
        maxLength={20}
      />

      <div className="flex flex-col gap-1.5">
        <Label isRequired>진행 상태</Label>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <Button
              key={opt.value}
              type="button"
              variant={goalCategoryStatus === opt.value ? 'primary' : 'outline'}
              onClick={() => onStatusChange(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      <Input
        label="시작일"
        isRequired
        type="date"
        value={goalCategoryStartDate}
        onChange={(e) => onStartDateChange(e.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <Label isRequired>색상</Label>
        <ColorPicker colors={colors} isLoading={isColorsLoading} selectedColorId={colorId} onSelect={onSelectColor} />
      </div>
    </div>
  )
}
