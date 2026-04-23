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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

  const isDone = task.actual !== null

  function handleDelete() {
    if (!confirm(`"${task.taskName}"을 삭제할까요?`)) return
    setIsMenuOpen(false)
    deleteTask(task.taskId)
  }

  return (
    <>
      <li className="border-border group flex flex-col gap-2 rounded-lg border px-4 py-3">
        {/* 상단 행: 체크 + 우선순위 + 이름 + ... */}
        <div className="flex items-center gap-3">
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

          {/* 태스크 이름 */}
          <p
            className={`min-w-0 flex-1 truncate text-sm font-medium ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}
          >
            {task.taskName}
          </p>

          {/* ... 메뉴 버튼 */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground rounded p-1 transition-colors"
              aria-label="더보기"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </button>

            {isMenuOpen && (
              <>
                {/* 외부 클릭 시 닫기 */}
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute top-7 right-0 z-20 min-w-[90px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      width="13"
                      height="13"
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
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 disabled:opacity-40"
                  >
                    <svg
                      width="13"
                      height="13"
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
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 하단 행: 상세 정보 */}
        <div className="ml-8 flex flex-wrap items-center gap-x-3 gap-y-1">
          {/* 목표 카테고리 */}
          {task.goalCategoryName && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {task.goalCategoryColorCode && (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: task.goalCategoryColorCode }}
                />
              )}
              {task.goalCategoryName}
            </span>
          )}

          {/* 일반 카테고리 */}
          {task.generalCategoryName && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              {task.generalCategoryColorCode && (
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: task.generalCategoryColorCode }}
                />
              )}
              {task.generalCategoryName}
            </span>
          )}

          {/* 계획 시간 */}
          <span className="text-muted-foreground text-xs">
            🕐 {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
            {task.plannedDurationMinutes != null && (
              <span className="ml-1 text-gray-400">({task.plannedDurationMinutes}분)</span>
            )}
          </span>

          {/* 실제 기록 */}
          {task.actual && (
            <span className="text-xs text-green-600">
              ✅ 실제 {utcIsoToKstTimeLabel(task.actual.actualStartAt)} ~{' '}
              {utcIsoToKstTimeLabel(task.actual.actualEndAt)}
              {task.actual.actualDurationMinutes != null && (
                <span className="ml-1 text-green-400">({task.actual.actualDurationMinutes}분)</span>
              )}
            </span>
          )}
        </div>
      </li>

      {isActualModalOpen && <TaskActualModal task={task} onClose={() => setIsActualModalOpen(false)} />}
      {isEditModalOpen && <TaskEditModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}
