'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useCreateTaskActual } from '../hooks/useCreateTaskActual'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { cn } from '@/src/lib/utils'
import { CreateTaskActualBody } from '../types'
import { localInputToUtc } from '@/src/lib/datetime'
import Label from '@/src/components/common/Label'

interface TaskActualModalProps {
  isOpen: boolean
  onClose: () => void
  date: string // 현재 날짜 (invalidate용)
  defaultDate?: string // datetime-local 기본값
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

  const generalCategories =
    goalCategories.find((g) => g.goalCategoryId === form.goalCategoryId)?.generalCategories ?? []

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleGoalChange(goalCategoryId: number | null) {
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
          placeholder="실제로 한 일을 입력해주세요"
          value={form.taskName}
          onChange={(e) => handleChange('taskName', e.target.value)}
          error={errors.taskName}
          required
        />

        {/* 목표 카테고리 */}
        <div className="flex flex-col gap-1.5">
          <Label isRequired={true}>목표 카테고리</Label>
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

        {/* 일반 카테고리 */}
        <div className="flex flex-col gap-1.5">
          <Label isRequired={true}>일반 카테고리</Label>
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

        {/* 실제 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="실제 시작"
            type="datetime-local"
            value={form.actualStartAt}
            onChange={(e) => handleChange('actualStartAt', e.target.value)}
            error={errors.actualStartAt}
            required
          />
          <Input
            label="실제 종료"
            type="datetime-local"
            value={form.actualEndAt}
            onChange={(e) => handleChange('actualEndAt', e.target.value)}
            error={errors.actualEndAt}
            required
          />
        </div>
      </div>
    </Modal>
  )
}
