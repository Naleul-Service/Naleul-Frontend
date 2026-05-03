import { Input } from '@/src/components/common/Input'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { GeneralCategoryItemType } from '@/src/features/category/api/goalCategory'

interface FormState {
  taskName: string
  goalCategoryId: number | null
  generalCategoryId: number | null
  actualStartAt: string
  actualEndAt: string
}

interface ActualTaskEditFormFieldsProps {
  form: FormState
  errors: Partial<Record<keyof FormState, string>>
  goalOptions: DropdownOption<number>[]
  generalOptions: DropdownOption<number>[]
  generalCategories: GeneralCategoryItemType[]
  isLoadingCategories: boolean
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onGoalChange: (id: number) => void
}

export function ActualTaskEditFormFields({
  form,
  errors,
  goalOptions,
  generalOptions,
  generalCategories,
  isLoadingCategories,
  onChange,
  onGoalChange,
}: ActualTaskEditFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="할 일"
        isRequired
        value={form.taskName}
        onChange={(e) => onChange('taskName', e.target.value)}
        error={errors.taskName}
      />

      <Dropdown
        label="목표"
        isRequired
        options={goalOptions}
        value={form.goalCategoryId}
        onChange={onGoalChange}
        placeholder={isLoadingCategories ? '불러오는 중...' : '목표를 선택해주세요'}
        disabled={isLoadingCategories}
        error={errors.goalCategoryId}
      />

      <Dropdown
        label="일반 카테고리"
        isRequired
        options={generalOptions}
        value={form.generalCategoryId}
        onChange={(v) => onChange('generalCategoryId', v)}
        placeholder={
          !form.goalCategoryId
            ? '목표를 먼저 선택해주세요'
            : generalCategories.length === 0
              ? '등록된 카테고리가 없어요'
              : '일반 카테고리를 선택해주세요'
        }
        disabled={!form.goalCategoryId || generalCategories.length === 0}
        error={errors.generalCategoryId}
      />

      <DateTimePicker
        label="실제 시작"
        isRequired
        value={form.actualStartAt}
        onChange={(v) => onChange('actualStartAt', v)}
        error={errors.actualStartAt}
      />

      <DateTimePicker
        label="실제 종료"
        isRequired
        value={form.actualEndAt}
        onChange={(v) => onChange('actualEndAt', v)}
        error={errors.actualEndAt}
      />
    </div>
  )
}
