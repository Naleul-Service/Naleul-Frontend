'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Task } from '@/src/features/task/types'
import { useTaskEditForm } from '@/src/features/task/hooks/useTaskEditForm'
import { TaskEditFormFields } from '@/src/features/task/ui/modal/field/TaskEditFormFields'

interface Props {
  task: Task
  onClose: () => void
}

export function DesktopTaskEditModal({ task, onClose }: Props) {
  const {
    taskName,
    setTaskName,
    priority,
    setPriority,
    plannedStartAt,
    setPlannedStartAt,
    plannedEndAt,
    setPlannedEndAt,
    goalCategoryId,
    handleGoalChange,
    goalOptions,
    generalCategoryId,
    generalOptions,
    generalCategories,
    isLoadingCategories,
    isValid,
    isPending,
    handleSubmit,
  } = useTaskEditForm(task, onClose)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="할 일 수정"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!isValid}
          >
            저장
          </Button>
        </div>
      }
    >
      <TaskEditFormFields
        taskName={taskName}
        onTaskNameChange={setTaskName}
        priority={priority}
        onPriorityChange={setPriority}
        plannedStartAt={plannedStartAt}
        onPlannedStartAtChange={setPlannedStartAt}
        plannedEndAt={plannedEndAt}
        onPlannedEndAtChange={setPlannedEndAt}
        goalCategoryId={goalCategoryId}
        onGoalChange={handleGoalChange}
        goalOptions={goalOptions}
        generalCategoryId={generalCategoryId}
        onGeneralChange={(v) => {}}
        generalOptions={generalOptions}
        generalCategories={generalCategories}
        isLoadingCategories={isLoadingCategories}
      />
    </Modal>
  )
}
