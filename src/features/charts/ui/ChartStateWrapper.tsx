// ChartStateWrapper.tsx

import ChartSkeleton from '@/src/features/charts/ui/ChartSkeleton'
import EmptyState from '@/src/components/common/EmptyState'

interface Props {
  isPending: boolean
  isError: boolean
  isEmpty: boolean
  children: () => React.ReactNode // 함수로 변경
}

export function ChartStateWrapper({ isPending, isError, isEmpty, children }: Props) {
  if (isPending) return <ChartSkeleton />
  if (isError) return <EmptyState message="데이터를 불러오지 못했습니다" />
  if (isEmpty) return <EmptyState message="기록된 Task가 없습니다" />
  return <>{children()}</> // 호출로 변경
}
