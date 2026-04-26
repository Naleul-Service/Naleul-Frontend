'use client'

import { DeleteIcon, EditIcon } from '@/src/assets/svgComponents'
import type { RetrospectiveResponse, ReviewType } from '../types'
import Badge from '@/src/components/common/Badge'

const TYPE_LABEL: Record<ReviewType, { title: string; textColor: string; bgColor: string }> = {
  DAILY: { title: '일간', bgColor: '#EBF3F5', textColor: '#145E72' },
  WEEKLY: { title: '주간', bgColor: '#FBF3E4', textColor: '#7A4E0A' },
  MONTHLY: { title: '월간', bgColor: '#F0EBF5', textColor: '#5C3585' },
}

interface Props {
  retrospective: RetrospectiveResponse
  onEdit: (retrospective: RetrospectiveResponse) => void
  onDelete: (retrospectiveId: number) => void
}

export function RetrospectiveCard({ retrospective, onEdit, onDelete }: Props) {
  function formatReviewDate(reviewType: ReviewType, reviewDate: string): string {
    const d = new Date(reviewDate)

    if (reviewType === 'DAILY') {
      return reviewDate // "2026-04-26"
    }

    if (reviewType === 'WEEKLY') {
      const end = new Date(d)
      end.setDate(d.getDate() + 6)
      const fmt = (date: Date) =>
        `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
      return `${fmt(d)} ~ ${fmt(end)}`
    }

    // MONTHLY
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
  }

  return (
    <>
      <div className="flex flex-col gap-y-[10px] rounded-[10px] border border-gray-100 p-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              bgColor={TYPE_LABEL[retrospective.reviewType].bgColor}
              textColor={TYPE_LABEL[retrospective.reviewType].textColor}
            >
              {TYPE_LABEL[retrospective.reviewType].title}
            </Badge>
            <span className="label-sm text-gray-500">
              {formatReviewDate(retrospective.reviewType, retrospective.reviewDate)}
            </span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex shrink-0 items-center gap-1">
            <EditIcon
              aria-label="수정"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(retrospective)
              }}
              width={24}
              height={24}
            />
            <DeleteIcon
              onClick={(e) => {
                e.stopPropagation()
                onDelete(retrospective.retrospectiveId)
              }}
              aria-label="삭제"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* 카테고리 뱃지 */}
        {(retrospective.goalCategoryName || retrospective.generalCategoryName) && (
          <div className="flex flex-wrap gap-2">
            {retrospective.goalCategoryName && (
              <Badge
                opacity={10}
                textColor={retrospective.goalCategoryColorCode}
                bgColor={retrospective.goalCategoryColorCode}
                botColor={retrospective.goalCategoryColorCode}
                type={'DOT'}
              >
                {retrospective.goalCategoryName}
              </Badge>
            )}
            {retrospective.generalCategoryName && (
              <Badge
                opacity={10}
                textColor={retrospective.generalCategoryColorCode}
                bgColor={retrospective.generalCategoryColorCode}
                botColor={retrospective.generalCategoryColorCode}
                type={'DOT'}
              >
                {retrospective.generalCategoryName}
              </Badge>
            )}
          </div>
        )}

        {/* 본문 — 미리보기 */}
        <p className="body-md text-gray-950">{retrospective.content}</p>
      </div>
    </>
  )
}
