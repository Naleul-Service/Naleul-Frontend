import { Input } from '@/src/components/common/Input'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { Button } from '@/src/components/common/Button'
import Label from '@/src/components/common/Label'
import { TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'
import { GeneralCategoryItemType } from '@/src/features/category/api/goalCategory'

interface FormState {
  taskName: string
  taskPriority: TaskPriority
  plannedStartAt: string
  plannedEndAt: string
  goalCategoryId: number | null
  generalCategoryId: number | null
}

interface AddTaskFormFieldsProps {
  form: FormState
  errors: Partial<Record<keyof FormState, string>>
  goalOptions: DropdownOption<number>[]
  generalOptions: DropdownOption<number>[]
  generalCategories: GeneralCategoryItemType[]
  isLoadingCategories: boolean
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  onGoalChange: (value: number) => void
}

export function AddTaskFormFields({
  form,
  errors,
  goalOptions,
  generalOptions,
  generalCategories,
  isLoadingCategories,
  onChange,
  onGoalChange,
}: AddTaskFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="할 일"
        isRequired
        placeholder="할 일을 입력해주세요"
        value={form.taskName}
        onChange={(e) => onChange('taskName', e.target.value)}
        error={errors.taskName}
      />

      <div className="flex flex-col gap-1.5">
        <Label isRequired>우선순위</Label>
        <div className="flex gap-2">
          {TASK_PRIORITIES.map((priority) => (
            <Button
              key={priority}
              type="button"
              className="w-full"
              variant={form.taskPriority === priority ? 'primary' : 'outline'}
              size="md"
              onClick={() => onChange('taskPriority', priority)}
            >
              {priority}
            </Button>
          ))}
        </div>
      </div>

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
        label="시작 시간"
        isRequired
        value={form.plannedStartAt}
        onChange={(v) => onChange('plannedStartAt', v)}
        error={errors.plannedStartAt}
      />
      <DateTimePicker
        label="종료 시간"
        isRequired
        value={form.plannedEndAt}
        onChange={(v) => onChange('plannedEndAt', v)}
        error={errors.plannedEndAt}
      />
    </div>
  )
}
