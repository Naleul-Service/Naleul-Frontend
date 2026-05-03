'use client'

import { useState } from 'react'
import { utcIsoToKstTimeLabel } from '@/src/lib/datetime'
import Badge from '@/src/components/common/Badge'
import { CheckIcon, OptionIcon, TimeIcon } from '@/src/assets/svgComponents'
import { TaskActualItem } from '@/src/features/task/types'
import { useDeleteTaskActual } from '@/src/features/task/hooks/useDeleteTaskActual'
import { ActualTaskEditModal } from '@/src/features/task/ui/modal/ActualTaskEditModal'

interface ActualTaskItemProps {
  actual: TaskActualItem
  date: string
}

export function ActualTaskItem({ actual, date }: ActualTaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { mutate: deleteActual, isPending: isDeleting } = useDeleteTaskActual(date)

  function handleDelete() {
    if (!confirm(`"${actual.taskName}" 기록을 삭제할까요?`)) return
    setIsMenuOpen(false)
    deleteActual(actual.taskActualId)
  }

  return (
    <>
      <li className="group flex flex-col gap-y-1 rounded-[10px] border border-gray-100 bg-white px-3 py-[10px]">
        {/* 상단 행 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-[10px]">
            <CheckIcon width={20} height={20} />
            <p className="body-md-medium min-w-0 flex-1 text-gray-500">{actual.taskName}</p>
          </div>

          {/* ... 메뉴 */}
          <div className="relative shrink-0">
            <OptionIcon
              iconColor="#475660"
              type="button"
              aria-label="더보기"
              onClick={() => setIsMenuOpen((v) => !v)}
              width={24}
              height={24}
            />
            {isMenuOpen && (
              <>
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

        {/* 하단 행 */}
        <div className="ml-8 flex flex-wrap items-center gap-[6px]">
          {actual.goalCategoryName && (
            <Badge
              opacity={10}
              textColor={actual.goalCategoryColorCode}
              bgColor={actual.goalCategoryColorCode}
              type="DOT"
              botColor={actual.goalCategoryColorCode}
            >
              {actual.goalCategoryName}
            </Badge>
          )}
          {actual.generalCategoryName && (
            <Badge
              opacity={10}
              textColor={actual.generalCategoryColorCode}
              bgColor={actual.generalCategoryColorCode}
              type="DOT"
              botColor={actual.generalCategoryColorCode}
            >
              {actual.generalCategoryName}
            </Badge>
          )}
          <div className="caption-md flex items-center text-[#34C759]">
            <TimeIcon width={24} height={24} />
            {utcIsoToKstTimeLabel(actual.actualStartAt)} ~ {utcIsoToKstTimeLabel(actual.actualEndAt)}
            {actual.actualDurationMinutes != null && <span className="ml-1">({actual.actualDurationMinutes}분)</span>}
          </div>
        </div>
      </li>

      {isEditModalOpen && <ActualTaskEditModal actual={actual} onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}
