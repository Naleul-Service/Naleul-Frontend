'use client'

import { useCompletedGoalCategories } from '@/src/features/completed/hooks/useCompletedGoalCategories'

export default function GoalStatsSummary() {
  const { data, isPending, isError } = useCompletedGoalCategories()

  // 첫 번째 페이지에서 통계 요약 정보 추출
  const summary = data?.pages[0]

  if (isPending) return <div className="flex gap-x-[20px]">로딩 중...</div>
  if (isError) return <div className="flex gap-x-[20px]">에러 발생</div>

  return (
    <div className="flex gap-x-[20px]" content="">
      <GoalStatsItem title="총 달성 목표" content={`${summary?.totalCompletedCount} 개`} />
      <GoalStatsItem title="누적 소요 시간" content={`${summary?.totalActualMinutes} m`} />
      <GoalStatsItem title="평균 진행 기간" content={`${summary?.averageDurationDays} 일`} />
    </div>
  )
}

function GoalStatsItem({ title, content }: { title: string; content: string }) {
  return (
    <div className="flex h-[120px] w-full flex-col justify-between rounded-[12px] border border-gray-100 bg-gray-50 px-6 py-5">
      <label className="body-md-medium text-gray-500">{title}</label>
      <div className="display-xl text-primary-600">{content}</div>
    </div>
  )
}
