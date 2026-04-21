'use client'

import { useState } from 'react'
import { Task } from '../types'
import { useUpdateActualTask } from '../hooks/useUpdateActualTask'
import { Input } from '@/src/components/common/Input'

interface TaskActualModalProps {
  task: Task
  onClose: () => void
}

function toDatetimeLocal(iso: string): string {
  // '2026-04-21T10:00:00' → datetime-local input 형식
  return iso.slice(0, 16)
}

function toISOString(datetimeLocal: string): string {
  // datetime-local → ISO 8601
  return new Date(datetimeLocal).toISOString()
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

export function TaskActualModal({ task, onClose }: TaskActualModalProps) {
  const [actualStartAt, setActualStartAt] = useState(
    task.actualStartAt ? toDatetimeLocal(task.actualStartAt) : toDatetimeLocal(task.plannedStartAt)
  )
  const [actualEndAt, setActualEndAt] = useState(
    task.actualEndAt ? toDatetimeLocal(task.actualEndAt) : toDatetimeLocal(task.plannedEndAt)
  )

  const { mutate, isPending, error } = useUpdateActualTask()

  const handleSubmit = () => {
    mutate(
      {
        taskId: task.taskId,
        body: {
          actualStartAt: toISOString(actualStartAt),
          actualEndAt: toISOString(actualEndAt),
        },
      },
      { onSuccess: onClose }
    )
  }

  return (
    // 백드롭
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-background border-border w-full max-w-sm rounded-2xl border p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-5">
          <p className="text-foreground text-base font-semibold">{task.taskName}</p>
          {task.goalCategoryName && <p className="text-muted-foreground mt-0.5 text-xs">{task.goalCategoryName}</p>}
        </div>

        {/* 계획 시간 (읽기 전용) */}
        <div className="bg-muted mb-5 rounded-lg px-4 py-3">
          <p className="text-muted-foreground mb-1 text-xs font-medium">계획</p>
          <p className="text-foreground text-sm">
            {formatTime(task.plannedStartAt)} ~ {formatTime(task.plannedEndAt)}
            <span className="text-muted-foreground ml-2 text-xs">({formatMinutes(task.plannedDurationMinutes)})</span>
          </p>
        </div>

        {/* 실제 시간 입력 */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-foreground mb-1 block text-xs font-medium">실제 시작</label>
            <Input type="datetime-local" value={actualStartAt} onChange={(e) => setActualStartAt(e.target.value)} />
          </div>
          <div>
            <label className="text-foreground mb-1 block text-xs font-medium">실제 종료</label>
            <Input type="datetime-local" value={actualEndAt} onChange={(e) => setActualEndAt(e.target.value)} />
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-red-500">{error.message}</p>}

        {/* 버튼 */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border-border text-muted-foreground flex-1 rounded-lg border py-2.5 text-sm"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-foreground text-background flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
