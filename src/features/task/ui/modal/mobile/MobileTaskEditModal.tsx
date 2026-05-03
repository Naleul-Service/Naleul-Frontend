'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { Task } from '@/src/features/task/types'
import { useTaskEditForm } from '@/src/features/task/hooks/useTaskEditForm'
import { TaskEditFormFields } from '@/src/features/task/ui/modal/field/TaskEditFormFields'

interface Props {
  task: Task
  onClose: () => void
}

export function MobileTaskEditModal({ task, onClose }: Props) {
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
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={onClose} headerType="dynamic" title="할 일 수정" />
      <div className="flex flex-col gap-5 p-4 pb-8">
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
        <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
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
      </div>
    </div>
  )
}
