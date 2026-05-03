import { useState } from 'react'
import { Task, TASK_PRIORITIES, TaskPriority, UpdateTaskBody } from '@/src/features/task/types'
import { useUpdateTask } from '@/src/features/task/hooks/useUpdateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { localInputToUtc, utcToLocalInput } from '@/src/lib/datetime'
import { DropdownOption } from '@/src/components/common/Dropdown'

export function useTaskEditForm(task: Task, onClose: () => void) {
  const { mutate, isPending } = useUpdateTask()
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  const [taskName, setTaskName] = useState(task.taskName)
  const [priority, setPriority] = useState<TaskPriority>(task.taskPriority as TaskPriority)
  const [plannedStartAt, setPlannedStartAt] = useState(utcToLocalInput(task.plannedStartAt))
  const [plannedEndAt, setPlannedEndAt] = useState(utcToLocalInput(task.plannedEndAt))
  const [goalCategoryId, setGoalCategoryId] = useState<number | null>(task.goalCategoryId ?? null)
  const [generalCategoryId, setGeneralCategoryId] = useState<number | null>(task.generalCategoryId ?? null)

  const generalCategories = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)?.generalCategories ?? []

  const goalOptions: DropdownOption<number>[] = goalCategories.map((g) => ({
    label: g.goalCategoryName,
    value: g.goalCategoryId,
  }))

  const generalOptions: DropdownOption<number>[] = generalCategories.map((g) => ({
    label: g.generalCategoryName,
    value: g.generalCategoryId,
  }))

  const isValid =
    taskName.trim().length > 0 && plannedStartAt < plannedEndAt && goalCategoryId !== null && generalCategoryId !== null

  function handleGoalChange(id: number) {
    setGoalCategoryId(id)
    setGeneralCategoryId(null)
  }

  function handleSubmit() {
    if (!isValid) return

    const body: UpdateTaskBody = {
      taskName: taskName.trim(),
      taskPriority: priority,
      plannedStartAt: localInputToUtc(plannedStartAt),
      plannedEndAt: localInputToUtc(plannedEndAt),
      goalCategoryId: goalCategoryId!,
      generalCategoryId: generalCategoryId!,
      defaultSettingStatus: false,
    }

    mutate({ taskId: task.taskId, body }, { onSuccess: onClose })
  }

  return {
    taskName,
    setTaskName,
    priority,
    setPriority,
    plannedStartAt,
    setPlannedStartAt,
    plannedEndAt,
    setPlannedEndAt,
    goalCategoryId,
    generalCategoryId,
    generalCategories,
    goalOptions,
    generalOptions,
    isLoadingCategories,
    isValid,
    isPending,
    handleGoalChange,
    handleSubmit,
    TASK_PRIORITIES,
  }
}
