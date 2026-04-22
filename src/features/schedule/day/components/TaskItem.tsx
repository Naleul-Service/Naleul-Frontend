'use client'

import { useState } from 'react'
import { Task } from '../types'
import { TaskActualModal } from './TaskActualModal'
import { useDeleteTask } from '@/src/features/task/hooks/useDeleteTask'
import { TaskEditModal } from '@/src/features/task/components/TaskEditModal'
import { utcIsoToKstTimeLabel } from '@/src/lib/datetime'

const PRIORITY_STYLE: Record<string, string> = {
  A: 'bg-red-500',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-green-500',
  E: 'bg-blue-500',
}

export function TaskItem({ task, date }: { task: Task; date: string }) {
  const [isActualModalOpen, setIsActualModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const today = new Date().toISOString().slice(0, 10) // "2026-04-21"
  const isDone = task.actual !== null

  function handleDelete() {
    if (!confirm(`"${task.taskName}"을 삭제할까요?`)) return
    deleteTask(task.taskId)
  }

  return (
    <>
      <li className="border-border group flex items-center gap-3 rounded-lg border px-4 py-3">
        {/* 완료 체크버튼 */}
        <button
          type="button"
          onClick={() => setIsActualModalOpen(true)}
          className={[
            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
            isDone ? 'border-transparent bg-green-500 text-white' : 'border-border hover:border-green-400',
          ].join(' ')}
          aria-label={isDone ? '완료됨' : '완료 기록하기'}
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d="M2 5l2.5 2.5L8 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* 우선순위 뱃지 */}
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${PRIORITY_STYLE[task.taskPriority] ?? 'bg-foreground'}`}
        >
          {task.taskPriority}
        </span>

        {/* 내용 */}
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-sm font-medium ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}
          >
            {task.taskName}
          </p>
          {task.goalCategoryName && (
            <p className="text-muted-foreground mt-0.5 truncate text-xs">{task.goalCategoryName}</p>
          )}
        </div>

        {/* 시간 */}
        <span className="text-muted-foreground shrink-0 text-xs">
          {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
        </span>

        {/* 수정/삭제 액션 — hover 시 노출 */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
            aria-label="수정"
          >
            {/* Pencil icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-muted-foreground rounded p-1 transition-colors hover:text-red-500 disabled:opacity-40"
            aria-label="삭제"
          >
            {/* Trash icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      </li>

      {isActualModalOpen && <TaskActualModal task={task} onClose={() => setIsActualModalOpen(false)} />}
      {isEditModalOpen && <TaskEditModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}
