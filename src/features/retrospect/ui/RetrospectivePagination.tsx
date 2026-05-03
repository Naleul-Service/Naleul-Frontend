interface RetrospectivePaginationProps {
  page: number
  totalPages: number
  isLast: boolean
  onPrev: () => void
  onNext: () => void
}

export function RetrospectivePagination({ page, totalPages, isLast, onPrev, onNext }: RetrospectivePaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={onPrev}
        disabled={page === 0}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
      >
        이전
      </button>
      <span className="text-sm text-gray-500">
        {page + 1} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={isLast}
        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
      >
        다음
      </button>
    </div>
  )
}
