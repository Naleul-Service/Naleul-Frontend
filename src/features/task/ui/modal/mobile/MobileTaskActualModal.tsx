'use client'

import { Button } from '@/src/components/common/Button'
import MobileHeader from '@/src/components/layout/MobileHeader'
import { Task } from '@/src/features/task/types'
import { useTaskActualForm } from '@/src/features/task/hooks/useTaskActualForm'
import { TaskActualFormFields } from '@/src/features/task/ui/modal/field/TaskActualFormFields'

interface Props {
  task: Task
  onClose: () => void
}

export function MobileTaskActualModal({ task, onClose }: Props) {
  const { actualStartAt, setActualStartAt, actualEndAt, setActualEndAt, isPending, error, handleSubmit } =
    useTaskActualForm(task, onClose)

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white">
      <MobileHeader onClick={onClose} headerType="dynamic" title={`'${task.taskName}' 완료`} />
      <div className="flex flex-col gap-5 p-4 pb-8">
        <TaskActualFormFields
          task={task}
          actualStartAt={actualStartAt}
          onActualStartAtChange={setActualStartAt}
          actualEndAt={actualEndAt}
          onActualEndAtChange={setActualEndAt}
          error={error}
        />
        <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3">
          <Button className="w-full" size="lg" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}
