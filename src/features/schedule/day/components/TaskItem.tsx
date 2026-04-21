'use client'

import { useState } from 'react'
import { Task } from '../types'
import { TaskActualModal } from './TaskActualModal'

const PRIORITY_STYLE: Record<string, string> = {
  A: 'bg-red-500',
  B: 'bg-orange-500',
  C: 'bg-yellow-500',
  D: 'bg-green-500',
  E: 'bg-blue-500',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export function TaskItem({ task }: { task: Task }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isDone = task.actualStartAt !== null && task.actualEndAt !== null

  return (
    <>
      <li className="border-border flex items-center gap-3 rounded-lg border px-4 py-3">
        {/* 완료 체크버튼 */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
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
          {formatTime(task.plannedStartAt)} ~ {formatTime(task.plannedEndAt)}
        </span>
      </li>

      {isModalOpen && <TaskActualModal task={task} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
