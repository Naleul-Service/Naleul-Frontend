'use client'

import { useState } from 'react'
import { Task } from '../types'
import { useUpdateActualTask } from '../hooks/useUpdateActualTask'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'

interface TaskActualModalProps {
  task: Task
  onClose: () => void
}

function toDatetimeLocal(iso: string): string {
  return iso.slice(0, 16)
}

function toISOString(local: string): string {
  return `${local}:00.000`
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

const today = new Date().toISOString().slice(0, 10)

export function TaskActualModal({ task, onClose }: TaskActualModalProps) {
  // 오늘 날짜 actual이 있으면 기존 값으로, 없으면 계획 시간으로 초기화
  const todayActual = task.actuals.find((a) => a.actualDate === today)

  const [actualStartAt, setActualStartAt] = useState(
    todayActual ? toDatetimeLocal(todayActual.actualStartAt) : toDatetimeLocal(task.plannedStartAt)
  )
  const [actualEndAt, setActualEndAt] = useState(
    todayActual ? toDatetimeLocal(todayActual.actualEndAt) : toDatetimeLocal(task.plannedEndAt)
  )

  const { mutate, isPending, error } = useUpdateActualTask()

  const handleSubmit = () => {
    mutate(
      {
        taskId: task.taskId,
        body: {
          actualDate: today,
          actualStartAt: toISOString(actualStartAt),
          actualEndAt: toISOString(actualEndAt),
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
          <Button variant="solid" className="flex-1" onClick={handleSubmit} isLoading={isPending}>
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
            {formatTime(task.plannedStartAt)} ~ {formatTime(task.plannedEndAt)}
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
