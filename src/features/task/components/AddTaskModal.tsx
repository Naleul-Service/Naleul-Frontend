'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useCreateTask } from '../hooks/useCreateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { cn } from '@/src/lib/utils'
import { CreateTaskBody, DAY_OF_WEEK_OPTIONS, TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  defaultDate?: string
}

interface FormState {
  taskName: string
  taskPriority: TaskPriority
  plannedStartAt: string
  plannedEndAt: string
  dayOfWeekIds: number[]
  goalCategoryId: number | null
  generalCategoryId: number | null
}

const INITIAL_FORM: FormState = {
  taskName: '',
  taskPriority: 'A',
  plannedStartAt: '',
  plannedEndAt: '',
  dayOfWeekIds: [],
  goalCategoryId: null,
  generalCategoryId: null,
}

function toISO(localDatetime: string): string {
  return localDatetime.length === 16 ? `${localDatetime}:00` : localDatetime
}

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {}
  if (!form.taskName.trim()) errors.taskName = '할 일 이름을 입력해주세요'
  if (!form.goalCategoryId) errors.goalCategoryId = '목표를 선택해주세요'
  if (!form.generalCategoryId) errors.generalCategoryId = '일반 카테고리를 선택해주세요'
  if (!form.plannedStartAt) errors.plannedStartAt = '시작 시간을 선택해주세요'
  if (!form.plannedEndAt) errors.plannedEndAt = '종료 시간을 선택해주세요'
  if (form.plannedStartAt && form.plannedEndAt && form.plannedStartAt >= form.plannedEndAt) {
    errors.plannedEndAt = '종료 시간은 시작 시간 이후여야 해요'
  }
  return errors
}

export function AddTaskModal({ isOpen, onClose, defaultDate }: AddTaskModalProps) {
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_FORM,
    plannedStartAt: defaultDate ?? '',
    plannedEndAt: defaultDate ?? '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const { mutate: createTask, isPending } = useCreateTask()
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  // 선택된 goal의 generalCategories 추출
  const generalCategories =
    goalCategories.find((g) => g.goalCategoryId === form.goalCategoryId)?.generalCategories ?? []

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  // goal 변경 시 general 초기화
  function handleGoalChange(goalCategoryId: number | null) {
    setForm((prev) => ({ ...prev, goalCategoryId, generalCategoryId: null }))
    setErrors((prev) => ({ ...prev, goalCategoryId: undefined, generalCategoryId: undefined }))
  }

  function toggleDayOfWeek(id: number) {
    const next = form.dayOfWeekIds.includes(id) ? form.dayOfWeekIds.filter((d) => d !== id) : [...form.dayOfWeekIds, id]
    handleChange('dayOfWeekIds', next)
  }

  function handleClose() {
    setForm(INITIAL_FORM)
    setErrors({})
    onClose()
  }

  function handleSubmit() {
    const nextErrors = validate(form)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const body: CreateTaskBody = {
      taskName: form.taskName.trim(),
      taskPriority: form.taskPriority,
      goalCategoryId: form.goalCategoryId!,
      generalCategoryId: form.generalCategoryId!,
      plannedStartAt: toISO(form.plannedStartAt),
      plannedEndAt: toISO(form.plannedEndAt),
      dayOfWeekIds: form.dayOfWeekIds, // 빈 배열이어도 항상 포함
      defaultSettingStatus: form.dayOfWeekIds.length > 0,
      ...(form.dayOfWeekIds.length > 0 && { dayOfWeekIds: form.dayOfWeekIds }),
    }

    createTask(body, { onSuccess: handleClose })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="할 일 추가"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button size="sm" onClick={handleSubmit} isLoading={isPending}>
            추가
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* 할 일 이름 */}
        <Input
          label="할 일"
          placeholder="할 일을 입력해주세요"
          value={form.taskName}
          onChange={(e) => handleChange('taskName', e.target.value)}
          error={errors.taskName}
          required
        />

        {/* 목표 카테고리 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-xs font-medium">
            목표 <span className="text-red-500">*</span>
          </label>
          <select
            value={form.goalCategoryId ?? ''}
            onChange={(e) => handleGoalChange(e.target.value ? Number(e.target.value) : null)}
            disabled={isLoadingCategories}
            className={cn(
              'bg-background text-foreground border-border h-9 w-full rounded-md border px-3 text-sm',
              'focus:border-foreground focus:ring-foreground transition-colors outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errors.goalCategoryId && 'border-red-400 focus:border-red-500 focus:ring-red-500'
            )}
          >
            <option value="">목표를 선택해주세요</option>
            {goalCategories.map((goal) => (
              <option key={goal.goalCategoryId} value={goal.goalCategoryId}>
                {goal.goalCategoryName}
              </option>
            ))}
          </select>
          {errors.goalCategoryId && <p className="text-xs text-red-500">{errors.goalCategoryId}</p>}
        </div>

        {/* 일반 카테고리 — goal 선택 후 활성화 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-xs font-medium">
            일반 카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            value={form.generalCategoryId ?? ''}
            onChange={(e) => handleChange('generalCategoryId', e.target.value ? Number(e.target.value) : null)}
            disabled={!form.goalCategoryId || generalCategories.length === 0}
            className={cn(
              'bg-background text-foreground border-border h-9 w-full rounded-md border px-3 text-sm',
              'focus:border-foreground focus:ring-foreground transition-colors outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              errors.generalCategoryId && 'border-red-400 focus:border-red-500 focus:ring-red-500'
            )}
          >
            <option value="">
              {!form.goalCategoryId
                ? '목표를 먼저 선택해주세요'
                : generalCategories.length === 0
                  ? '등록된 카테고리가 없어요'
                  : '일반 카테고리를 선택해주세요'}
            </option>
            {generalCategories.map((general) => (
              <option key={general.generalCategoryId} value={general.generalCategoryId}>
                {general.generalCategoryName}
              </option>
            ))}
          </select>
          {errors.generalCategoryId && <p className="text-xs text-red-500">{errors.generalCategoryId}</p>}
        </div>

        {/* 우선순위 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-xs font-medium">우선순위</span>
          <div className="flex gap-2">
            {TASK_PRIORITIES.map((priority) => (
              <button
                key={priority}
                type="button"
                onClick={() => handleChange('taskPriority', priority)}
                className={cn(
                  'h-8 w-10 rounded-md text-xs font-semibold transition-colors',
                  form.taskPriority === priority
                    ? 'bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted border'
                )}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        {/* 시작 시간 */}
        <Input
          label="시작 시간"
          type="datetime-local"
          value={form.plannedStartAt}
          onChange={(e) => handleChange('plannedStartAt', e.target.value)}
          error={errors.plannedStartAt}
          required
        />

        {/* 종료 시간 */}
        <Input
          label="종료 시간"
          type="datetime-local"
          value={form.plannedEndAt}
          onChange={(e) => handleChange('plannedEndAt', e.target.value)}
          error={errors.plannedEndAt}
          required
        />

        {/* 반복 요일 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-xs font-medium">
            반복 요일
            <span className="text-muted-foreground ml-1 font-normal">(선택)</span>
          </span>
          <div className="flex gap-1.5">
            {DAY_OF_WEEK_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleDayOfWeek(id)}
                className={cn(
                  'h-8 flex-1 rounded-md text-xs font-medium transition-colors',
                  form.dayOfWeekIds.includes(id)
                    ? 'bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted border'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
