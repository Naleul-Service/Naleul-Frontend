// features/retrospective/ui/RetrospectiveListPage.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
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
import PageHeader from '@/src/components/layout/PageHeader'
import { FilterIcon } from '@/src/assets/svgComponents'
import { Button } from '@/src/components/common/Button'
import { PlusIcon } from 'lucide-react'
import { Modal } from '@/src/components/common/Modal'

type ModalState = { type: 'closed' } | { type: 'create' } | { type: 'edit'; data: RetrospectiveResponse }

// RetrospectiveListPage.tsx 상단에 추가
function RetrospectiveFilterPopover({
  goalCategoryId,
  generalCategoryId,
  goalCategories,
  onGoalCategoryChange,
  onGeneralCategoryChange,
  onPageReset,
}: {
  goalCategoryId: number | undefined
  generalCategoryId: number | undefined
  goalCategories: GoalCategory[]
  onGoalCategoryChange: (id: number | undefined) => void
  onGeneralCategoryChange: (id: number | undefined) => void
  onPageReset: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false)
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const hasActiveFilter = goalCategoryId !== undefined || generalCategoryId !== undefined
  const selectedGoalCategory = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)
  const generalCategories = selectedGoalCategory?.generalCategories ?? []

  return (
    <div ref={ref} className="relative">
      {/* 트리거 버튼 */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'rounded-[8px] border transition-colors',
          hasActiveFilter ? 'border-foreground bg-foreground/5' : 'border-gray-100',
        ].join(' ')}
        aria-label="필터"
        aria-expanded={isOpen}
      >
        <FilterIcon width={32} height={32} />
      </button>

      {/* 팝오버 패널 */}
      {isOpen && (
        <div className="bg-background absolute top-full left-0 z-50 mt-2 w-[440px] rounded-[12px] border border-gray-200 p-4">
          <div className="flex flex-col gap-3">
            {/* 목표 카테고리 */}
            <div className="flex items-start gap-2">
              <span className="body-md-medium w-20 shrink-0 text-gray-300">목표</span>
              <div className="flex flex-wrap gap-1.5">
                <Chip
                  active={goalCategoryId === undefined}
                  onClick={() => {
                    onGoalCategoryChange(undefined)
                    onPageReset()
                  }}
                >
                  전체
                </Chip>
                {goalCategories.map((g) => (
                  <Chip
                    key={g.goalCategoryId}
                    active={goalCategoryId === g.goalCategoryId}
                    onClick={() => {
                      onGoalCategoryChange(g.goalCategoryId)
                      onPageReset()
                    }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode ?? '#637580' }} />
                    {g.goalCategoryName}
                  </Chip>
                ))}
              </div>
            </div>

            {/* 일반 카테고리 */}
            {selectedGoalCategory && (
              <div className="flex items-start gap-2">
                <span className="body-md-medium w-20 shrink-0 text-gray-300">카테고리</span>
                <div className="flex flex-wrap gap-1.5">
                  <Chip
                    active={generalCategoryId === undefined}
                    onClick={() => {
                      onGeneralCategoryChange(undefined)
                      onPageReset()
                    }}
                  >
                    전체
                  </Chip>
                  {generalCategories.map((g) => (
                    <Chip
                      key={g.generalCategoryId}
                      active={generalCategoryId === g.generalCategoryId}
                      onClick={() => {
                        onGeneralCategoryChange(g.generalCategoryId)
                        onPageReset()
                      }}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: g.colorCode ?? '#637580' }} />
                      {g.generalCategoryName}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

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
    <div className="flex flex-col gap-y-[24px] p-5">
      {/* 헤더 */}
      <PageHeader title="회고" subtitle={'지나간 시간을 돌아보고 다음을 계획해요'} />

      {/* 필터 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <RetrospectiveFilter
            selectedType={reviewType}
            onTypeChange={handleFilterTypeChange}
            baseDate={baseDate}
            onDateChange={(d) => {
              setBaseDate(d)
              setPage(0)
            }}
          />

          <RetrospectiveFilterPopover
            goalCategoryId={goalCategoryId}
            generalCategoryId={generalCategoryId}
            goalCategories={goalCategories}
            onGoalCategoryChange={handleGoalCategoryChange}
            onGeneralCategoryChange={setGeneralCategoryId}
            onPageReset={() => setPage(0)}
          />
        </div>

        <Button onClick={() => setModal({ type: 'create' })} leftIcon={<PlusIcon size={16} />} size={'md'}>
          회고 추가
        </Button>
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
        <Modal
          isOpen={modal.type === 'create' || modal.type === 'edit'}
          title={modal.type === 'create' ? '회고 작성' : modal.type === 'edit' ? '회고 수정' : ''}
          onClose={() => setModal({ type: 'closed' })}
        >
          {modal.type === 'create' && (
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
          )}
          {modal.type === 'edit' && (
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

function today() {
  return new Date().toISOString().slice(0, 10)
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'label-sm flex items-center gap-1 rounded-full px-[10px] py-1 transition-colors',
        active
          ? 'bg-foreground text-background'
          : 'hover:text-foreground border border-gray-100 bg-gray-50 text-gray-500',
      ].join(' ')}
    >
      {children}
    </button>
  )
}
