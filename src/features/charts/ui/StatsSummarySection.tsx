// src/features/charts/ui/StatsSummarySection.tsx

import Badge from '@/src/components/common/Badge'
import GoalStatsItem from '@/src/components/common/GoalStatsItem'
import { formatMinutes } from '@/src/features/charts/constants'
import type { useChartData } from '../hooks/useChartData'

type ChartData = ReturnType<typeof useChartData>

export function StatsSummarySection({
  goalCategory,
  goalDetail,
  achievement,
}: Pick<ChartData, 'goalCategory' | 'goalDetail' | 'achievement'>) {
  return (
    <section className="tablet:gap-x-4 desktop:gap-x-5 flex gap-x-3">
      <GoalStatsItem
        title="총 소요 시간"
        content={goalCategory.isPending ? '-' : formatMinutes(goalCategory.data?.totalMinutes ?? 0)}
      />
      <GoalStatsItem
        title="계획 달성률"
        badge={
          <div className="desktop:block tablet:block hidden">
            <Badge bgColor={'#C4DDE3'} textColor={'#0D4556'}>
              50% 일치 수준
            </Badge>
          </div>
        }
        content={achievement.isPending ? '-' : `${achievement.data?.achievementRate ?? 0}%`}
        indicator={
          achievement.isPending
            ? '-'
            : `${achievement.data?.achievedCount ?? 0}/${achievement.data?.totalCount ?? 0} Task`
        }
      />
      <GoalStatsItem title="총 목표" content={goalDetail.isPending ? '-' : `${goalDetail.data?.length ?? 0} 개`} />
    </section>
  )
}
