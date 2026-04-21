// src/features/task/components/TaskEditModal.tsx
'use client'

import { useState } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { cn } from '@/src/lib/utils'
import { UpdateTaskBody } from '@/src/features/task/types'
import { Task } from '@/src/features/schedule/day/types'

const PRIORITIES = ['A', 'B', 'C', 'D', 'E'] as const
type Priority = (typeof PRIORITIES)[number]

const PRIORITY_STYLE: Record<Priority, string> = {
  A: 'bg-red-500',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-green-500',
  E: 'bg-blue-500',
}

function toDatetimeLocal(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16)
}

function toISOString(local: string): string {
  return `${local}:00.000` // "2026-04-20T17:38:00.000"
}

interface Props {
  task: Task
  onClose: () => void
}

export function TaskEditModal({ task, onClose }: Props) {
  const { mutate, isPending } = useUpdateTask()

  const [taskName, setTaskName] = useState(task.taskName)
  const [priority, setPriority] = useState<Priority>(task.taskPriority as Priority)
  const [plannedStartAt, setPlannedStartAt] = useState(toDatetimeLocal(task.plannedStartAt))
  const [plannedEndAt, setPlannedEndAt] = useState(toDatetimeLocal(task.plannedEndAt))

  const isValid = taskName.trim().length > 0 && plannedStartAt < plannedEndAt

  const DAY_NAME_TO_ID: Record<string, number> = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
  }

  function toDayOfWeekIds(dayNames: string[]): number[] {
    return dayNames.map((name) => DAY_NAME_TO_ID[name]).filter(Boolean)
  }

  function handleSubmit() {
    if (!isValid) return

    const body: UpdateTaskBody = {
      taskName: taskName.trim(),
      taskPriority: priority,
      plannedStartAt: toISOString(plannedStartAt),
      plannedEndAt: toISOString(plannedEndAt),
      // task에서 기존 값 유지
      goalCategoryId: task.goalCategoryId ?? undefined,
      generalCategoryId: task.generalCategoryId ?? undefined,
      dayOfWeekIds: toDayOfWeekIds(task.dayNames),
      defaultSettingStatus: task.defaultSettingStatus ?? false,
    }

    mutate({ taskId: task.taskId, body }, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="할 일 수정"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button variant="solid" className="flex-1" onClick={handleSubmit} isLoading={isPending} disabled={!isValid}>
            저장
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* 할 일 이름 */}
        <Input
          label="할 일"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="할 일을 입력하세요"
          clearable
          onClear={() => setTaskName('')}
          error={taskName.trim().length === 0 ? '할 일을 입력해주세요' : undefined}
          required
        />

        {/* 우선순위 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-xs font-medium">우선순위</span>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white transition-all',
                  PRIORITY_STYLE[p],
                  priority === p
                    ? 'ring-foreground scale-110 opacity-100 ring-2 ring-offset-2'
                    : 'opacity-40 hover:opacity-70'
                )}
                aria-label={`우선순위 ${p}`}
                aria-pressed={priority === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="시작 시간"
            type="datetime-local"
            value={plannedStartAt}
            onChange={(e) => setPlannedStartAt(e.target.value)}
          />
          <Input
            label="종료 시간"
            type="datetime-local"
            value={plannedEndAt}
            onChange={(e) => setPlannedEndAt(e.target.value)}
            error={plannedStartAt >= plannedEndAt ? '종료 시간을 확인해주세요' : undefined}
          />
        </div>
      </div>
    </Modal>
  )
}
