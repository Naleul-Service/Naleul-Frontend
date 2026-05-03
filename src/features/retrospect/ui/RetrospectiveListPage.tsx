'use client'

import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useRetrospectiveList } from '../hooks/useRetrospectiveList'
import { useDeleteRetrospective } from '../hooks/useRetrospectiveMutations'
import { useRetrospectiveFilter } from '../hooks/useRetrospectiveFilter'
import { useRetrospectiveModal } from '../hooks/useRetrospectiveModal'
import { RetrospectiveCard } from './RetrospectiveCard'
import { RetrospectiveFilter } from './RetrospectiveFilter'
import { RetrospectiveEmptyState } from './RetrospectiveEmptyState'
import { RetrospectiveModal } from './modal/RetrospectiveModal'
import PageHeader from '@/src/components/layout/PageHeader'
import { Button } from '@/src/components/common/Button'
import { PlusIcon } from 'lucide-react'
import { RetrospectivePagination } from '@/src/features/retrospect/ui/RetrospectivePagination'

export function RetrospectiveListPage() {
  const { data: goalCategories = [] } = useGoalCategories()
  const { modal, openCreate, openEdit, close } = useRetrospectiveModal()
  const {
    reviewType,
    baseDate,
    goalCategoryId,
    generalCategoryId,
    page,
    setPage,
    handleFilterTypeChange,
    handleGoalCategoryChange,
    handleGeneralCategoryChange,
    handleDateChange,
  } = useRetrospectiveFilter()

  // RetrospectiveListPage.tsx
  const { data, isLoading, isError } = useRetrospectiveList({
    reviewType,
    baseDate: baseDate || undefined,
    goalCategoryId,
    generalCategoryId,
    page,
    size: 10,
    sort: 'reviewDate,desc',
  })

  const { mutate: deleteRetrospective } = useDeleteRetrospective()

  function handleDelete(id: number) {
    if (!confirm('회고를 삭제할까요?')) return
    deleteRetrospective(id)
  }

  return (
    <div className="flex flex-col gap-y-[24px] p-5">
      <PageHeader
        title="회고"
        subtitle="지나간 시간을 돌아보고 다음을 계획해요"
        rightElement={
          <Button onClick={openCreate} leftIcon={<PlusIcon size={16} />} size="md">
            회고 추가
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <RetrospectiveFilter
          selectedType={reviewType}
          onTypeChange={handleFilterTypeChange}
          baseDate={baseDate}
          onDateChange={handleDateChange}
          goalCategoryId={goalCategoryId}
          generalCategoryId={generalCategoryId}
          goalCategories={goalCategories}
          onGoalCategoryChange={handleGoalCategoryChange}
          onGeneralCategoryChange={handleGeneralCategoryChange}
        />
      </div>

      {isLoading && <div className="flex justify-center py-20 text-sm text-gray-400">불러오는 중...</div>}
      {isError && <div className="flex justify-center py-20 text-sm text-red-400">데이터를 불러오지 못했습니다.</div>}

      {!isLoading && !isError && (
        <>
          {data?.content.length === 0 ? (
            <RetrospectiveEmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {data?.content.map((item) => (
                <RetrospectiveCard
                  key={item.retrospectiveId}
                  retrospective={item}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <RetrospectivePagination
              page={page}
              totalPages={data.totalPages}
              isLast={data.last}
              onPrev={() => setPage((p) => p - 1)}
              onNext={() => setPage((p) => p + 1)}
            />
          )}
        </>
      )}

      <RetrospectiveModal modal={modal} onClose={close} goalCategories={goalCategories} />
    </div>
  )
}
