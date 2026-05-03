import { useState } from 'react'
import { Task } from '@/src/features/task/types'
import { useUpdateActualTask } from '@/src/features/task/hooks/useUpdateActualTask'
import { localInputToUtc, utcToLocalInput } from '@/src/lib/datetime'

export function useTaskActualForm(task: Task, onClose: () => void) {
  const dateActual = task.actual
  const { mutate, isPending, error } = useUpdateActualTask()

  const [actualStartAt, setActualStartAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualStartAt) : utcToLocalInput(task.plannedStartAt)
  )
  const [actualEndAt, setActualEndAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualEndAt) : utcToLocalInput(task.plannedEndAt)
  )

  function handleSubmit() {
    mutate(
      {
        taskId: task.taskId,
        body: {
          actualStartAt: localInputToUtc(actualStartAt),
          actualEndAt: localInputToUtc(actualEndAt),
        },
      },
      { onSuccess: onClose }
    )
  }

  return {
    actualStartAt,
    setActualStartAt,
    actualEndAt,
    setActualEndAt,
    isPending,
    error,
    handleSubmit,
  }
}
