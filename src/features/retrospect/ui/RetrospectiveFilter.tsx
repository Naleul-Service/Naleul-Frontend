// features/retrospective/ui/RetrospectiveFilter.tsx
// 타입 필터 + 날짜 + 카테고리 필터 컨트롤

'use client'

import type { ReviewType } from '../types'

const REVIEW_TYPE_LABELS: Record<ReviewType | 'ALL', string> = {
  ALL: '전체',
  DAILY: '일간',
  WEEKLY: '주간',
  MONTHLY: '월간',
}

interface Props {
  selectedType: ReviewType | undefined
  onTypeChange: (type: ReviewType | undefined) => void
  baseDate: string
  onDateChange: (date: string) => void
}

export function RetrospectiveFilter({ selectedType, onTypeChange, baseDate, onDateChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 타입 탭 */}
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        {(['ALL', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => {
          const value = type === 'ALL' ? undefined : type
          const isActive = selectedType === value
          return (
            <button
              key={type}
              onClick={() => onTypeChange(value)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                isActive ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {REVIEW_TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>

      {/* 날짜 */}
      <input
        type="date"
        value={baseDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
      />
    </div>
  )
}
