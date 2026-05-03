import { useState } from 'react'
import { useCreateTask } from '@/src/features/task/hooks/useCreateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { localInputToUtc } from '@/src/lib/datetime'
import { CreateTaskBody, TASK_PRIORITIES, TaskPriority } from '@/src/features/task/types'
import { DropdownOption } from '@/src/components/common/Dropdown'

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

export function useAddTaskForm({ defaultDate, onClose }: { defaultDate?: string; onClose: () => void }) {
  const { mutate: createTask, isPending } = useCreateTask()
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  const [form, setForm] = useState<FormState>(() => ({
    ...INITIAL_FORM,
    plannedStartAt: defaultDate ?? '',
    plannedEndAt: defaultDate ?? '',
  }))
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

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

  return {
    form,
    errors,
    isPending,
    isLoadingCategories,
    goalOptions,
    generalOptions,
    generalCategories,
    TASK_PRIORITIES,
    handleChange,
    handleGoalChange,
    handleClose,
    handleSubmit,
  }
}
