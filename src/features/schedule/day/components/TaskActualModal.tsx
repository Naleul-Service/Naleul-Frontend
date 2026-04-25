'use client'

import { useState } from 'react'
import { Task } from '../types'
import { useUpdateActualTask } from '../hooks/useUpdateActualTask'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { localInputToUtc, utcIsoToKstTimeLabel, utcToLocalInput } from '@/src/lib/datetime'

interface TaskActualModalProps {
  task: Task
  date: string
  onClose: () => void
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

export function TaskActualModal({ task, date, onClose }: TaskActualModalProps) {
  const dateActual = task.actual

  const [actualStartAt, setActualStartAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualStartAt) : utcToLocalInput(task.plannedStartAt)
  )
  const [actualEndAt, setActualEndAt] = useState(
    dateActual ? utcToLocalInput(dateActual.actualEndAt) : utcToLocalInput(task.plannedEndAt)
  )

  const { mutate, isPending, error } = useUpdateActualTask(date)

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
      <div className="flex flex-col gap-4">
        {/* 계획 시간 */}
        <div className="flex flex-col gap-y-[6px] rounded-[10px] bg-gray-50 px-4 py-3">
          <p className="body-md-medium text-gray-300">계획</p>
          <div className="flex items-center gap-x-2">
            <p className="body-lg-medium">
              {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
            </p>
            <span className="h4 text-primary-400">{formatMinutes(task.plannedDurationMinutes)}</span>
          </div>
        </div>

        <DateTimePicker label="실제 시작" value={actualStartAt} onChange={setActualStartAt} />
        <DateTimePicker label="실제 종료" value={actualEndAt} onChange={setActualEndAt} />

        {error && <p className="text-xs text-red-500">{error.message}</p>}
      </div>
    </Modal>
  )
}
