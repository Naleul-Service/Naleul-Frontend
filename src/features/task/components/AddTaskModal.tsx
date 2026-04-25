'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useCreateTask } from '../hooks/useCreateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { CreateTaskBody, TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'
import { localInputToUtc } from '@/src/lib/datetime'
import Label from '@/src/components/common/Label'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'

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
  goalCategoryId: number | null
  generalCategoryId: number | null
}

const INITIAL_FORM: FormState = {
  taskName: '',
  taskPriority: 'A',
  plannedStartAt: '',
  plannedEndAt: '',
  goalCategoryId: null,
  generalCategoryId: null,
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

  const generalCategories =
    goalCategories.find((g) => g.goalCategoryId === form.goalCategoryId)?.generalCategories ?? []

  const goalOptions: DropdownOption<number>[] = goalCategories.map((g) => ({
    label: g.goalCategoryName,
    value: g.goalCategoryId,
  }))

  const generalOptions: DropdownOption<number>[] = generalCategories.map((g) => ({
    label: g.generalCategoryName,
    value: g.generalCategoryId,
  }))

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleGoalChange(goalCategoryId: number) {
    setForm((prev) => ({ ...prev, goalCategoryId, generalCategoryId: null }))
    setErrors((prev) => ({ ...prev, goalCategoryId: undefined, generalCategoryId: undefined }))
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
      plannedStartAt: localInputToUtc(form.plannedStartAt),
      plannedEndAt: localInputToUtc(form.plannedEndAt),
      defaultSettingStatus: false,
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
          <Button variant="secondary" size="lg" className="w-full" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            추가
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="할 일"
          isRequired
          placeholder="할 일을 입력해주세요"
          value={form.taskName}
          onChange={(e) => handleChange('taskName', e.target.value)}
          error={errors.taskName}
        />

        {/* 우선순위 */}
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
                onClick={() => handleChange('taskPriority', priority)}
              >
                {priority}
              </Button>
            ))}
          </div>
        </div>

        {/* 목표 카테고리 */}
        <Dropdown
          label="목표"
          isRequired
          options={goalOptions}
          value={form.goalCategoryId}
          onChange={handleGoalChange}
          placeholder={isLoadingCategories ? '불러오는 중...' : '목표를 선택해주세요'}
          disabled={isLoadingCategories}
          error={errors.goalCategoryId}
        />

        {/* 일반 카테고리 */}
        <Dropdown
          label="일반 카테고리"
          isRequired
          options={generalOptions}
          value={form.generalCategoryId}
          onChange={(v) => handleChange('generalCategoryId', v)}
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

        {/* 시간 */}
        <DateTimePicker
          label="시작 시간"
          isRequired
          value={form.plannedStartAt}
          onChange={(v) => handleChange('plannedStartAt', v)}
          error={errors.plannedStartAt}
        />
        <DateTimePicker
          label="종료 시간"
          isRequired
          value={form.plannedEndAt}
          onChange={(v) => handleChange('plannedEndAt', v)}
          error={errors.plannedEndAt}
        />
      </div>
    </Modal>
  )
}
