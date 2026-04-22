// features/retrospective/ui/RetrospectiveForm.tsx

'use client'

import { useState } from 'react'
import type {
  RetrospectiveCreateRequest,
  RetrospectiveResponse,
  RetrospectiveUpdateRequest,
  ReviewType,
} from '../types'

const REVIEW_TYPES: { value: ReviewType; label: string }[] = [
  { value: 'DAILY', label: '일간' },
  { value: 'WEEKLY', label: '주간' },
  { value: 'MONTHLY', label: '월간' },
]

interface CategoryOption {
  id: number
  name: string
}

interface CreateMode {
  mode: 'create'
  goalCategories: CategoryOption[]
  generalCategories: CategoryOption[]
  onSubmit: (data: RetrospectiveCreateRequest) => void
  onGoalCategoryChange?: (id: number | null) => void
}

interface EditMode {
  mode: 'edit'
  initialData: RetrospectiveResponse
  goalCategories: CategoryOption[]
  generalCategories: CategoryOption[]
  onSubmit: (data: RetrospectiveUpdateRequest) => void
  onGoalCategoryChange?: (id: number | null) => void
}

type Props = (CreateMode | EditMode) & {
  isLoading?: boolean
  onCancel: () => void
}

export function RetrospectiveForm(props: Props) {
  const isEdit = props.mode === 'edit'

  const [reviewType, setReviewType] = useState<ReviewType>(isEdit ? props.initialData.reviewType : 'DAILY')
  const [reviewDate, setReviewDate] = useState(isEdit ? props.initialData.reviewDate : today())
  const [content, setContent] = useState(isEdit ? props.initialData.content : '')
  const [goalCategoryId, setGoalCategoryId] = useState<number | null>(
    isEdit ? (props.initialData.goalCategoryId ?? null) : null
  )
  const [generalCategoryId, setGeneralCategoryId] = useState<number | null>(
    isEdit ? (props.initialData.generalCategoryId ?? null) : null
  )

  const handleGoalCategoryChange = (id: number | null) => {
    setGoalCategoryId(id)
    setGeneralCategoryId(null) // goalCategory 바뀌면 generalCategory 초기화
    props.onGoalCategoryChange?.(id)
  }

  const handleSubmit = () => {
    if (!content.trim()) return

    if (isEdit) {
      ;(props as EditMode).onSubmit({ content, goalCategoryId, generalCategoryId })
    } else {
      ;(props as CreateMode).onSubmit({
        reviewType,
        reviewDate,
        content,
        goalCategoryId,
        generalCategoryId,
      })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 타입 선택 (수정 시 비활성) */}
      {!isEdit && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">회고 유형</label>
          <div className="flex gap-2">
            {REVIEW_TYPES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setReviewType(value)
                  setReviewDate(getDefaultDate(value))
                }}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  reviewType === value
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 날짜 (수정 시 비활성) */}
      {!isEdit && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">날짜</label>
          <input
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
          />
        </div>
      )}

      {/* 목표 카테고리 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          목표 카테고리 <span className="text-gray-400">(선택)</span>
        </label>
        <select
          value={goalCategoryId ?? ''}
          onChange={(e) => handleGoalCategoryChange(e.target.value ? Number(e.target.value) : null)}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
        >
          <option value="">선택 안 함</option>
          {props.goalCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 일반 카테고리 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          일반 카테고리 <span className="text-gray-400">(선택)</span>
        </label>
        <select
          value={generalCategoryId ?? ''}
          onChange={(e) => setGeneralCategoryId(e.target.value ? Number(e.target.value) : null)}
          disabled={!goalCategoryId}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="">선택 안 함</option>
          {props.generalCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* 내용 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          placeholder="회고 내용을 입력하세요..."
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={props.onCancel}
          className="flex-1 rounded-lg bg-gray-100 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() || props.isLoading}
          className="flex-1 rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {props.isLoading ? '저장 중...' : isEdit ? '수정' : '저장'}
        </button>
      </div>
    </div>
  )
}

// ── 헬퍼 ──────────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10)
}

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function getFirstDayOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10)
}

function getDefaultDate(type: ReviewType): string {
  const now = new Date()
  switch (type) {
    case 'DAILY':
      return today()
    case 'WEEKLY':
      return getMonday(now)
    case 'MONTHLY':
      return getFirstDayOfMonth(now)
  }
}
