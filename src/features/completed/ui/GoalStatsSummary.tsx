'use client'

import { useCompletedGoalCategories } from '@/src/features/completed/hooks/useCompletedGoalCategories'
import GoalStatsItem from '@/src/components/common/GoalStatsItem'
import { formatMinutes } from '@/src/features/charts/constants'

export default function GoalStatsSummary() {
  const { data, isPending, isError } = useCompletedGoalCategories()

  // 첫 번째 페이지에서 통계 요약 정보 추출
  const summary = data?.pages[0]

  if (isPending) return <div className="flex gap-x-[20px]">로딩 중...</div>
  if (isError) return <div className="flex gap-x-[20px]">에러 발생</div>

  return (
    <div className="flex gap-x-[20px]" content="">
      <GoalStatsItem title="총 달성 목표" content={`${summary?.totalCompletedCount} 개`} />
      <GoalStatsItem title="누적 소요 시간" content={`${formatMinutes(summary?.totalActualMinutes)}`} />
      <GoalStatsItem title="평균 진행 기간" content={`${summary?.averageDurationDays} 일`} />
    </div>
  )
}
