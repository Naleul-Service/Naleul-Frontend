// features/retrospective/ui/RetrospectiveListPage.tsx

'use client'

import { useState } from 'react'
import { useRetrospectiveList } from '../hooks/useRetrospectiveList'
import {
  useCreateRetrospective,
  useDeleteRetrospective,
  useUpdateRetrospective,
} from '../hooks/useRetrospectiveMutations'
import { RetrospectiveCard } from './RetrospectiveCard'
import { RetrospectiveFilter } from './RetrospectiveFilter'
import { RetrospectiveForm } from './RetrospectiveForm'
import type { RetrospectiveResponse, ReviewType } from '../types'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'

type ModalState = { type: 'closed' } | { type: 'create' } | { type: 'edit'; data: RetrospectiveResponse }

export function RetrospectiveListPage() {
  const [reviewType, setReviewType] = useState<ReviewType | undefined>()
  const [baseDate, setBaseDate] = useState(today())
  const [goalCategoryId, setGoalCategoryId] = useState<number | undefined>()
  const [generalCategoryId, setGeneralCategoryId] = useState<number | undefined>()
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })

  // 실제 카테고리 데이터
  const { data: goalCategories = [] } = useGoalCategories()

  // 선택된 goalCategory의 generalCategories
  const selectedGoalCategory = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

  // 회고 목록
  const { data, isLoading, isError } = useRetrospectiveList({
    reviewType,
    baseDate: reviewType ? baseDate : undefined,
    goalCategoryId,
    generalCategoryId,
    page,
    size: 10,
    sort: 'reviewDate,desc',
  })

  const createMutation = useCreateRetrospective()
  const deleteMutation = useDeleteRetrospective()

  const handleDelete = (id: number) => {
    if (!confirm('회고를 삭제할까요?')) return
    deleteMutation.mutate(id)
  }

  const handleFilterTypeChange = (type: ReviewType | undefined) => {
    setReviewType(type)
    setGeneralCategoryId(undefined) // 타입 바뀌면 하위 필터 초기화
    setPage(0)
  }

  const handleGoalCategoryChange = (id: number | undefined) => {
    setGoalCategoryId(id)
    setGeneralCategoryId(undefined) // goalCategory 바뀌면 generalCategory 초기화
    setPage(0)
  }

  // goalCategories → Form용 CategoryOption으로 변환
  const goalCategoryOptions = goalCategories.map((g) => ({
    id: g.goalCategoryId,
    name: g.goalCategoryName,
  }))
  const generalCategoryOptions = generalCategories.map((g) => ({
    id: g.generalCategoryId,
    name: g.generalCategoryName,
  }))

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">회고</h1>
        <button
          onClick={() => setModal({ type: 'create' })}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          + 회고 작성
        </button>
      </div>

      {/* 필터 */}
      <div className="mb-6 flex flex-col gap-3">
        <RetrospectiveFilter
          selectedType={reviewType}
          onTypeChange={handleFilterTypeChange}
          baseDate={baseDate}
          onDateChange={(d) => {
            setBaseDate(d)
            setPage(0)
          }}
        />

        <div className="flex gap-2">
          {/* 목표 카테고리 필터 */}
          <select
            value={goalCategoryId ?? ''}
            onChange={(e) => handleGoalCategoryChange(e.target.value ? Number(e.target.value) : undefined)}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
          >
            <option value="">목표 전체</option>
            {goalCategories.map((g) => (
              <option key={g.goalCategoryId} value={g.goalCategoryId}>
                {g.goalCategoryName}
              </option>
            ))}
          </select>

          {/* 일반 카테고리 필터 — goalCategory 선택 시에만 활성화 */}
          <select
            value={generalCategoryId ?? ''}
            onChange={(e) => {
              setGeneralCategoryId(e.target.value ? Number(e.target.value) : undefined)
              setPage(0)
            }}
            disabled={!goalCategoryId}
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <option value="">카테고리 전체</option>
            {generalCategories.map((g) => (
              <option key={g.generalCategoryId} value={g.generalCategoryId}>
                {g.generalCategoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 목록 */}
      {isLoading && <div className="flex justify-center py-20 text-sm text-gray-400">불러오는 중...</div>}
      {isError && <div className="flex justify-center py-20 text-sm text-red-400">데이터를 불러오지 못했습니다.</div>}

      {!isLoading && !isError && (
        <>
          {data?.content.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-gray-400">
              <span className="text-3xl">📝</span>
              <p className="text-sm">작성된 회고가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data?.content.map((item) => (
                <RetrospectiveCard
                  key={item.retrospectiveId}
                  retrospective={item}
                  onEdit={(r) => setModal({ type: 'edit', data: r })}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                이전
              </button>
              <span className="text-sm text-gray-500">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={data.last}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                다음
              </button>
            </div>
          )}
        </>
      )}

      {/* 모달 */}
      {modal.type !== 'closed' && (
        <Modal title={modal.type === 'create' ? '회고 작성' : '회고 수정'} onClose={() => setModal({ type: 'closed' })}>
          {modal.type === 'create' ? (
            <RetrospectiveForm
              mode="create"
              goalCategories={goalCategoryOptions}
              generalCategories={generalCategoryOptions}
              isLoading={createMutation.isPending}
              onSubmit={(data) =>
                createMutation.mutate(data, {
                  onSuccess: () => setModal({ type: 'closed' }),
                })
              }
              onCancel={() => setModal({ type: 'closed' })}
            />
          ) : (
            <EditModalContent
              data={modal.data}
              goalCategories={goalCategoryOptions}
              goalCategoriesRaw={goalCategories}
              onClose={() => setModal({ type: 'closed' })}
            />
          )}
        </Modal>
      )}
    </div>
  )
}

// 수정 모달: generalCategories를 선택된 goalCategory 기준으로 동적 계산
function EditModalContent({
  data,
  goalCategories,
  goalCategoriesRaw,
  onClose,
}: {
  data: RetrospectiveResponse
  goalCategories: { id: number; name: string }[]
  goalCategoriesRaw: ReturnType<typeof useGoalCategories>['data'] // GoalCategory[]
  onClose: () => void
}) {
  const updateMutation = useUpdateRetrospective(data.retrospectiveId)

  // 수정 폼에서 goalCategory 변경 시 generalCategories도 연동
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(data.goalCategoryId ?? null)

  const selectedGoal = goalCategoriesRaw?.find((g) => g.goalCategoryId === selectedGoalId)
  const generalCategoryOptions = (selectedGoal?.generalCategories ?? []).map((g) => ({
    id: g.generalCategoryId,
    name: g.generalCategoryName,
  }))

  return (
    <RetrospectiveForm
      mode="edit"
      initialData={data}
      goalCategories={goalCategories}
      generalCategories={generalCategoryOptions}
      isLoading={updateMutation.isPending}
      onGoalCategoryChange={setSelectedGoalId} // Form에 콜백 추가 필요
      onSubmit={(body) => updateMutation.mutate(body, { onSuccess: onClose })}
      onCancel={onClose}
    />
  )
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-700">
            ✕
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

function today() {
  return new Date().toISOString().slice(0, 10)
}
