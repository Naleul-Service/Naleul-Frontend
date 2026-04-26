// features/retrospective/ui/RetrospectiveForm.tsx

'use client'

import { useState } from 'react'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
import type {
  RetrospectiveCreateRequest,
  RetrospectiveResponse,
  RetrospectiveUpdateRequest,
  ReviewType,
} from '../types'
import { Dropdown } from '@/src/components/common/Dropdown'
import { DatePicker } from '@/src/components/common/picker/DatePicker'
import { Button } from '@/src/components/common/Button'

const REVIEW_TYPES: { value: ReviewType; label: string }[] = [
  { value: 'DAILY', label: '일간' },
  { value: 'WEEKLY', label: '주간' },
  { value: 'MONTHLY', label: '월간' },
]

interface CreateMode {
  mode: 'create'
  goalCategories: GoalCategory[]
  onSubmit: (data: RetrospectiveCreateRequest) => void
}

interface EditMode {
  mode: 'edit'
  initialData: RetrospectiveResponse
  goalCategories: GoalCategory[]
  onSubmit: (data: RetrospectiveUpdateRequest) => void
}

type Props = (CreateMode | EditMode) & {
  isLoading?: boolean
  onCancel: () => void
}

export function RetrospectiveForm(props: Props) {
  const isEdit = props.mode === 'edit'

  const [reviewType, setReviewType] = useState<ReviewType>(isEdit ? props.initialData.reviewType : 'DAILY')
  const [reviewDate, setReviewDate] = useState(isEdit ? props.initialData.reviewDate : getDefaultDate('DAILY'))
  const [content, setContent] = useState(isEdit ? props.initialData.content : '')
  const [goalCategoryId, setGoalCategoryId] = useState<number | null>(
    isEdit ? (props.initialData.goalCategoryId ?? null) : null
  )
  const [generalCategoryId, setGeneralCategoryId] = useState<number | null>(
    isEdit ? (props.initialData.generalCategoryId ?? null) : null
  )

  // goalCategoryId 기준으로 generalCategories 직접 계산
  const selectedGoalCategory = props.goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

  const handleGoalCategoryChange = (id: number | null) => {
    setGoalCategoryId(id)
    setGeneralCategoryId(null) // goalCategory 바뀌면 초기화
  }

  const handleReviewTypeChange = (type: ReviewType) => {
    setReviewType(type)
    setReviewDate(getDefaultDate(type))
  }

  const handleSubmit = () => {
    if (!content.trim()) return
    if (isEdit) {
      ;(props as EditMode).onSubmit({ content, goalCategoryId, generalCategoryId })
    } else {
      ;(props as CreateMode).onSubmit({ reviewType, reviewDate, content, goalCategoryId, generalCategoryId })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 타입 선택 (수정 시 숨김) */}
      {!isEdit && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">회고 유형</label>
          <div className="flex gap-2">
            {REVIEW_TYPES.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                className="w-full"
                onClick={() => handleReviewTypeChange(value)}
                variant={reviewType === value ? 'primary' : 'outline'}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 날짜 — 타입별로 다른 input */}
      {!isEdit && (
        <>
          {/* 날짜 */}
          <DatePicker
            label="날짜"
            variant={reviewType === 'DAILY' ? 'day' : reviewType === 'WEEKLY' ? 'week' : 'month'}
            value={reviewDate}
            onChange={(date) => {
              if (reviewType === 'WEEKLY') setReviewDate(getMonday(new Date(date)))
              else if (reviewType === 'MONTHLY') setReviewDate(`${date.slice(0, 7)}-01`)
              else setReviewDate(date)
            }}
          />
        </>
      )}

      {/* 목표 카테고리 */}
      <Dropdown
        label="목표 카테고리"
        placeholder="선택 안 함"
        value={goalCategoryId}
        onChange={(v) => handleGoalCategoryChange(Number(v))}
        options={[
          ...props.goalCategories.map((g) => ({
            label: g.goalCategoryName,
            value: g.goalCategoryId,
          })),
        ]}
      />

      {/* 일반 카테고리 */}
      <Dropdown
        label="일반 카테고리"
        placeholder={!goalCategoryId ? '목표 카테고리를 먼저 선택하세요' : '선택 안 함'}
        value={generalCategoryId}
        onChange={(v) => setGeneralCategoryId(Number(v))}
        disabled={!goalCategoryId || generalCategories.length === 0}
        options={generalCategories.map((g) => ({
          label: g.generalCategoryName,
          value: g.generalCategoryId,
        }))}
      />

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

// ── 날짜 헬퍼 ─────────────────────────────────────────────

function today() {
  return new Date().toISOString().slice(0, 10)
}

function getMonday(date: Date): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function getDefaultDate(type: ReviewType): string {
  const now = new Date()
  switch (type) {
    case 'DAILY':
      return today()
    case 'WEEKLY':
      return getMonday(now)
    case 'MONTHLY':
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  }
}

// "yyyy-MM-dd" → input[type=week] value인 "yyyy-Www"
function dateToWeekValue(dateStr: string): string {
  const date = new Date(dateStr)
  const year = date.getFullYear()

  // ISO 주차 계산
  const startOfYear = new Date(year, 0, 1)
  const diff = date.getTime() - startOfYear.getTime()
  const weekNum = Math.ceil((diff / 86400000 + startOfYear.getDay() + 1) / 7)

  return `${year}-W${String(weekNum).padStart(2, '0')}`
}

// input[type=week] value인 "yyyy-Www" → 해당 주 월요일 "yyyy-MM-dd"
function weekValueToMonday(weekValue: string): string {
  const [yearStr, weekStr] = weekValue.split('-W')
  const year = Number(yearStr)
  const week = Number(weekStr)

  // 해당 연도 1월 4일 (항상 1주차에 포함)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7 // 일=0을 7로
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - (jan4Day - 1) + (week - 1) * 7)

  return monday.toISOString().slice(0, 10)
}

// 주간 범위 레이블: "2025년 18주 (04/28 ~ 05/04)"
function getWeekRangeLabel(mondayStr: string): string {
  const monday = new Date(mondayStr)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`

  return `${fmt(monday)} ~ ${fmt(sunday)}`
}

// 월간 레이블: "2025년 5월"
function getMonthLabel(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`
}
