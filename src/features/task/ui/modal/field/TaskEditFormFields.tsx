import { Input } from '@/src/components/common/Input'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { Button } from '@/src/components/common/Button'
import Label from '@/src/components/common/Label'
import { TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'
import { GeneralCategoryItemType } from '@/src/features/category/api/goalCategory'

interface TaskEditFormFieldsProps {
  taskName: string
  onTaskNameChange: (value: string) => void
  priority: TaskPriority
  onPriorityChange: (value: TaskPriority) => void
  plannedStartAt: string
  onPlannedStartAtChange: (value: string) => void
  plannedEndAt: string
  onPlannedEndAtChange: (value: string) => void
  goalCategoryId: number | null
  onGoalChange: (id: number) => void
  goalOptions: DropdownOption<number>[]
  generalCategoryId: number | null
  onGeneralChange: (id: number) => void
  generalOptions: DropdownOption<number>[]
  generalCategories: GeneralCategoryItemType[]
  isLoadingCategories: boolean
}

export function TaskEditFormFields({
  taskName,
  onTaskNameChange,
  priority,
  onPriorityChange,
  plannedStartAt,
  onPlannedStartAtChange,
  plannedEndAt,
  onPlannedEndAtChange,
  goalCategoryId,
  onGoalChange,
  goalOptions,
  generalCategoryId,
  onGeneralChange,
  generalOptions,
  generalCategories,
  isLoadingCategories,
}: TaskEditFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="할 일"
        isRequired
        value={taskName}
        onChange={(e) => onTaskNameChange(e.target.value)}
        placeholder="할 일을 입력하세요"
        clearable
        onClear={() => onTaskNameChange('')}
        error={taskName.trim().length === 0 ? '할 일을 입력해주세요' : undefined}
      />

      <Dropdown
        label="목표"
        isRequired
        options={goalOptions}
        value={goalCategoryId}
        onChange={onGoalChange}
        placeholder={isLoadingCategories ? '불러오는 중...' : '목표를 선택해주세요'}
        disabled={isLoadingCategories}
      />

      <Dropdown
        label="일반 카테고리"
        isRequired
        options={generalOptions}
        value={generalCategoryId}
        onChange={onGeneralChange}
        placeholder={
          !goalCategoryId
            ? '목표를 먼저 선택해주세요'
            : generalCategories.length === 0
              ? '등록된 카테고리가 없어요'
              : '일반 카테고리를 선택해주세요'
        }
        disabled={!goalCategoryId || generalCategories.length === 0}
      />

      <div className="flex flex-col gap-1.5">
        <Label>우선순위</Label>
        <div className="flex gap-2">
          {TASK_PRIORITIES.map((p) => (
            <Button
              key={p}
              type="button"
              className="w-full"
              variant={priority === p ? 'primary' : 'outline'}
              size="md"
              onClick={() => onPriorityChange(p)}
            >
              {p}
            </Button>
          ))}
        </div>
      </div>

      <DateTimePicker label="시작 시간" isRequired value={plannedStartAt} onChange={onPlannedStartAtChange} />
      <DateTimePicker
        label="종료 시간"
        isRequired
        value={plannedEndAt}
        onChange={onPlannedEndAtChange}
        error={plannedStartAt >= plannedEndAt ? '종료 시간을 확인해주세요' : undefined}
      />
    </div>
  )
}
