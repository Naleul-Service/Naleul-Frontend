// features/retrospective/ui/RetrospectiveCard.tsx

'use client'

import type { RetrospectiveResponse, ReviewType } from '../types'

const TYPE_LABEL: Record<ReviewType, string> = {
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
}

const TYPE_COLOR: Record<ReviewType, string> = {
  DAILY: 'bg-blue-50 text-blue-600',
  WEEKLY: 'bg-green-50 text-green-600',
  MONTHLY: 'bg-purple-50 text-purple-600',
}

interface Props {
  retrospective: RetrospectiveResponse
  onEdit: (retrospective: RetrospectiveResponse) => void
  onDelete: (retrospectiveId: number) => void
}

export function RetrospectiveCard({ retrospective, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* 헤더 */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLOR[retrospective.reviewType]}`}>
            {TYPE_LABEL[retrospective.reviewType]}
          </span>
          <span className="text-xs text-gray-400">{retrospective.reviewDate}</span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEdit(retrospective)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="수정"
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(retrospective.retrospectiveId)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="삭제"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* 카테고리 뱃지 */}
      {(retrospective.goalCategoryName || retrospective.generalCategoryName) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {retrospective.goalCategoryName && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              🎯 {retrospective.goalCategoryName}
            </span>
          )}
          {retrospective.generalCategoryName && (
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              📁 {retrospective.generalCategoryName}
            </span>
          )}
        </div>
      )}

      {/* 본문 */}
      <p className="line-clamp-3 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{retrospective.content}</p>
    </div>
  )
}

// 인라인 아이콘 (lucide 없을 때 대비)
function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
