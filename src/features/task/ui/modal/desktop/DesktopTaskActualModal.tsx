'use client'

import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Task } from '@/src/features/task/types'
import { useTaskActualForm } from '@/src/features/task/hooks/useTaskActualForm'
import { TaskActualFormFields } from '@/src/features/task/ui/modal/field/TaskActualFormFields'

interface Props {
  task: Task
  onClose: () => void
}

export function DesktopTaskActualModal({ task, onClose }: Props) {
  const { actualStartAt, setActualStartAt, actualEndAt, setActualEndAt, isPending, error, handleSubmit } =
    useTaskActualForm(task, onClose)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`'${task.taskName}' 완료`}
      description={task.goalCategoryName ?? undefined}
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={onClose}>
            취소
          </Button>
          <Button className="w-full" size="lg" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      }
    >
      <TaskActualFormFields
        task={task}
        actualStartAt={actualStartAt}
        onActualStartAtChange={setActualStartAt}
        actualEndAt={actualEndAt}
        onActualEndAtChange={setActualEndAt}
        error={error}
      />
    </Modal>
  )
}
