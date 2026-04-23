// features/retrospective/ui/RetrospectiveListPage.tsx

'use client'

import { useState } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import type { GoalCategory } from '@/src/features/category/api/goalCategory'
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

type ModalState = { type: 'closed' } | { type: 'create' } | { type: 'edit'; data: RetrospectiveResponse }

export function RetrospectiveListPage() {
  const [reviewType, setReviewType] = useState<ReviewType | undefined>()
  const [baseDate, setBaseDate] = useState(today())
  const [goalCategoryId, setGoalCategoryId] = useState<number | undefined>()
  const [generalCategoryId, setGeneralCategoryId] = useState<number | undefined>()
  const [page, setPage] = useState(0)
  const [modal, setModal] = useState<ModalState>({ type: 'closed' })

  const { data: goalCategories = [] } = useGoalCategories()

  // 필터용 generalCategories — 선택된 goalCategory 기준
  const selectedGoalCategory = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

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
    setGeneralCategoryId(undefined)
    setPage(0)
  }

  const handleGoalCategoryChange = (id: number | undefined) => {
    setGoalCategoryId(id)
    setGeneralCategoryId(undefined)
    setPage(0)
  }

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
              goalCategories={goalCategories}
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
              goalCategories={goalCategories}
              onClose={() => setModal({ type: 'closed' })}
            />
          )}
        </Modal>
      )}
    </div>
  )
}

// EditModalContent — goalCategoriesRaw, goalCategoryOptions 변환 전부 제거
function EditModalContent({
  data,
  goalCategories,
  onClose,
}: {
  data: RetrospectiveResponse
  goalCategories: GoalCategory[]
  onClose: () => void
}) {
  const updateMutation = useUpdateRetrospective(data.retrospectiveId)

  return (
    <RetrospectiveForm
      mode="edit"
      initialData={data}
      goalCategories={goalCategories}
      isLoading={updateMutation.isPending}
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
