import { useState } from 'react'
import { useCreateTaskActual } from '@/src/features/task/hooks/useCreateTaskActual'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { localInputToUtc } from '@/src/lib/datetime'
import { CreateTaskActualBody } from '@/src/features/task/types'
import { DropdownOption } from '@/src/components/common/Dropdown'

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

export function useCreateTaskActualForm({
  date,
  defaultDate,
  onClose,
}: {
  date: string
  defaultDate?: string
  onClose: () => void
}) {
  const { mutate: createActual, isPending } = useCreateTaskActual(date)
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_FORM,
    actualStartAt: defaultDate ?? '',
    actualEndAt: defaultDate ?? '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

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

  return {
    form,
    errors,
    isPending,
    isLoadingCategories,
    goalOptions,
    generalOptions,
    generalCategories,
    handleChange,
    handleGoalChange,
    handleClose,
    handleSubmit,
  }
}
