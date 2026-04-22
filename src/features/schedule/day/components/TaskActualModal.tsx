'use client'

import { useState } from 'react'
import { Task } from '../types'
import { useUpdateActualTask } from '../hooks/useUpdateActualTask'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { localInputToUtc, utcIsoToKstTimeLabel, utcToLocalInput } from '@/src/lib/datetime'

interface TaskActualModalProps {
  task: Task
  onClose: () => void
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

export function TaskActualModal({ task, onClose }: TaskActualModalProps) {
  const dateActual = task.actual

  const [actualStartAt, setActualStartAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualStartAt) : utcToLocalInput(task.plannedStartAt)
  )
  const [actualEndAt, setActualEndAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualEndAt) : utcToLocalInput(task.plannedEndAt)
  )

  const { mutate, isPending, error } = useUpdateActualTask()

  const handleSubmit = () => {
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

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={task.taskName}
      description={task.goalCategoryName ?? undefined}
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} isLoading={isPending}>
            저장
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 계획 시간 */}
        <div className="bg-muted rounded-lg px-4 py-3">
          <p className="text-muted-foreground mb-1 text-xs font-medium">계획</p>
          <p className="text-foreground text-sm">
            {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
            <span className="text-muted-foreground ml-2 text-xs">({formatMinutes(task.plannedDurationMinutes)})</span>
          </p>
        </div>

        {/* 실제 시간 입력 */}
        <Input
          label="실제 시작"
          type="datetime-local"
          value={actualStartAt}
          onChange={(e) => setActualStartAt(e.target.value)}
        />
        <Input
          label="실제 종료"
          type="datetime-local"
          value={actualEndAt}
          onChange={(e) => setActualEndAt(e.target.value)}
        />

        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    </Modal>
  )
}
