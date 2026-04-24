'use client'

import { useState } from 'react'
import { Task } from '../types'
import { TaskActualModal } from './TaskActualModal'
import { useDeleteTask } from '@/src/features/task/hooks/useDeleteTask'
import { TaskEditModal } from '@/src/features/task/components/TaskEditModal'
import { utcIsoToKstTimeLabel } from '@/src/lib/datetime'
import Badge from '@/src/components/common/Badge'
import { CheckIcon, OptionIcon, TimeIcon, UncheckIcon } from '@/src/assets/svgComponents'
import PriorityBadge from '@/src/components/common/PriorityBadge'

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
      <li className="group flex flex-col gap-y-1 rounded-[10px] border border-gray-100 px-3 py-[10px]">
        {/* 상단 행: 체크 + 우선순위 + 이름 + ... */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-[10px]">
            {/* 완료 체크버튼 */}
            {isDone ? (
              <CheckIcon width={20} height={20} />
            ) : (
              <UncheckIcon
                type="button"
                onClick={() => setIsActualModalOpen(true)}
                width={20}
                height={20}
                aria-label={isDone ? '완료됨' : '완료 기록하기'}
              />
            )}
            <div className="flex gap-x-[6px]">
              {/* 우선순위 뱃지 */}
              <PriorityBadge label={task.taskPriority} />

              {/* 태스크 이름 */}
              <p className={`body-md-medium min-w-0 flex-1 ${isDone ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
                {task.taskName}
              </p>
            </div>
          </div>

          {/* ... 메뉴 버튼 */}
          <div className="relative shrink-0">
            <OptionIcon
              iconColor={'#475660'}
              type="button"
              aria-label="더보기"
              onClick={() => setIsMenuOpen((v) => !v)}
              width={24}
              height={24}
            />

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
        <div className="ml-8 flex flex-wrap items-center gap-[6px]">
          {/* 목표 카테고리 */}
          {task.goalCategoryName && (
            <Badge
              textColor={task.goalCategoryColorCode}
              bgColor={task.goalCategoryColorCode}
              type={'DOT'}
              botColor={task.goalCategoryColorCode}
            >
              {task.goalCategoryName}
            </Badge>
          )}

          {/* 일반 카테고리 */}
          {task.generalCategoryName && (
            <Badge
              textColor={task.generalCategoryColorCode}
              bgColor={task.generalCategoryColorCode}
              type={'DOT'}
              botColor={task.generalCategoryColorCode}
            >
              {task.generalCategoryName}
            </Badge>
          )}

          {/* 계획 시간 */}
          <div className="caption-md flex items-center text-gray-400">
            <TimeIcon width={24} height={24} />
            {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
            {task.plannedDurationMinutes != null && (
              <span className="ml-1 text-gray-400">({task.plannedDurationMinutes}분)</span>
            )}
          </div>

          {/* 실제 기록 */}
          {task.actual && (
            <div className="caption-md mt-1 flex items-center gap-x-[6px] text-[#34C759]">
              <CheckIcon width={13} height={13} />
              실제 {utcIsoToKstTimeLabel(task.actual.actualStartAt)} ~ {utcIsoToKstTimeLabel(task.actual.actualEndAt)}
              {task.actual.actualDurationMinutes != null && (
                <span className="ml-1">({task.actual.actualDurationMinutes}분)</span>
              )}
            </div>
          )}
        </div>
      </li>

      {isActualModalOpen && <TaskActualModal date={date} task={task} onClose={() => setIsActualModalOpen(false)} />}
      {isEditModalOpen && <TaskEditModal task={task} onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}
