'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { useCreateTaskActual } from '../hooks/useCreateTaskActual'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { CreateTaskActualBody } from '../types'
import { localInputToUtc } from '@/src/lib/datetime'

interface TaskActualModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
  defaultDate?: string
}

interface FormState {
  taskName: string
  goalCategoryId: number | null
  generalCategoryId: number | null
  actualStartAt: string
  actualEndAt: string
}

const INITIAL_FORM: FormState = {
  taskName: '',
  goalCategoryId: null,
  generalCategoryId: null,
  actualStartAt: '',
  actualEndAt: '',
}

function validate(form: FormState): Partial<Record<keyof FormState, string>> {
  const errors: Partial<Record<keyof FormState, string>> = {}
  if (!form.taskName.trim()) errors.taskName = '할 일 이름을 입력해주세요'
  if (!form.goalCategoryId) errors.goalCategoryId = '목표를 선택해주세요'
  if (!form.generalCategoryId) errors.generalCategoryId = '일반 카테고리를 선택해주세요'
  if (!form.actualStartAt) errors.actualStartAt = '시작 시간을 선택해주세요'
  if (!form.actualEndAt) errors.actualEndAt = '종료 시간을 선택해주세요'
  if (form.actualStartAt && form.actualEndAt && form.actualStartAt >= form.actualEndAt) {
    errors.actualEndAt = '종료 시간은 시작 시간 이후여야 해요'
  }
  return errors
}

export function CreateTaskActualModal({ isOpen, onClose, date, defaultDate }: TaskActualModalProps) {
  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_FORM,
    actualStartAt: defaultDate ?? '',
    actualEndAt: defaultDate ?? '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const { mutate: createActual, isPending } = useCreateTaskActual(date)
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  const goalOptions: DropdownOption<number>[] = goalCategories.map((g) => ({
    label: g.goalCategoryName,
    value: g.goalCategoryId,
  }))

  const generalCategories =
    goalCategories.find((g) => g.goalCategoryId === form.goalCategoryId)?.generalCategories ?? []

  const generalOptions: DropdownOption<number>[] = generalCategories.map((g) => ({
    label: g.generalCategoryName,
    value: g.generalCategoryId,
  }))

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleGoalChange(value: number) {
    setForm((prev) => ({ ...prev, goalCategoryId: value, generalCategoryId: null }))
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

    const body: CreateTaskActualBody = {
      taskId: null,
      taskName: form.taskName.trim(),
      goalCategoryId: form.goalCategoryId!,
      generalCategoryId: form.generalCategoryId!,
      actualStartAt: localInputToUtc(form.actualStartAt),
      actualEndAt: localInputToUtc(form.actualEndAt),
    }

    createActual(body, { onSuccess: handleClose })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="실제 시간 기록"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="할 일"
          isRequired
          placeholder="실제로 한 일을 입력해주세요"
          value={form.taskName}
          onChange={(e) => handleChange('taskName', e.target.value)}
          error={errors.taskName}
        />

        <Dropdown
          label="목표 카테고리"
          isRequired
          options={goalOptions}
          value={form.goalCategoryId}
          onChange={handleGoalChange}
          placeholder={isLoadingCategories ? '불러오는 중...' : '목표를 선택해주세요'}
          disabled={isLoadingCategories}
          error={errors.goalCategoryId}
        />

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

        <DateTimePicker
          label="실제 시작"
          isRequired
          value={form.actualStartAt}
          onChange={(v) => handleChange('actualStartAt', v)}
          error={errors.actualStartAt}
        />

        <DateTimePicker
          label="실제 종료"
          isRequired
          value={form.actualEndAt}
          onChange={(v) => handleChange('actualEndAt', v)}
          error={errors.actualEndAt}
        />
      </div>
    </Modal>
  )
}
