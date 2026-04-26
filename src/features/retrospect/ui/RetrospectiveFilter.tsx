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
    <nav className="label-md flex w-fit gap-1 rounded-[8px] bg-gray-50 px-[6px] py-[5px] text-gray-300">
      {/* 타입 탭 */}
      <div className="flex overflow-hidden">
        {(['ALL', 'DAILY', 'WEEKLY', 'MONTHLY'] as const).map((type) => {
          const value = type === 'ALL' ? undefined : type
          const isActive = selectedType === value
          return (
            <button
              key={type}
              onClick={() => onTypeChange(value)}
              className={[
                'flex-1 rounded-md px-4 py-1.5 text-center transition-colors',
                isActive ? 'bg-white text-gray-950 shadow-sm' : 'bg-gray-50 hover:text-gray-300',
              ].join(' ')}
            >
              {REVIEW_TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
