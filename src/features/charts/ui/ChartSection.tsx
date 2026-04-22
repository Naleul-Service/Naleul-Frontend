'use client'

import { useGoalCategoryChart } from '../hooks/useGoalCategoryChart'
import { useGoalCategoryDetailChart } from '../hooks/useGoalCategoryDetailChart'
import { useGeneralCategoryChart } from '../hooks/useGeneralCategoryChart'
import { GoalCategoryBarChart } from './GoalCategoryBarChart'
import { GoalCategoryDetailChart } from './GoalCategoryDetailChart'
import { GeneralCategoryDonutChart } from './GeneralCategoryDonutChart'
import { useAchievementChart } from '@/src/features/charts/hooks/useAchievementChart'
import { AchievementDonutChart } from '@/src/features/charts/ui/AchievementDonutChart'

function SectionWrapper({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function ChartSkeleton() {
  return <div className="h-[160px] animate-pulse rounded-xl bg-gray-100" />
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[120px] items-center justify-center rounded-xl bg-gray-50">
      <p className="text-sm text-gray-300">{message}</p>
    </div>
  )
}

export function ChartSection() {
  const goalCategory = useGoalCategoryChart()
  const goalDetail = useGoalCategoryDetailChart()
  const generalCategory = useGeneralCategoryChart()
  const achievement = useAchievementChart()

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 7-1-1: 전체 카테고리 */}
      <SectionWrapper title="전체 카테고리">
        {goalCategory.isPending ? (
          <ChartSkeleton />
        ) : goalCategory.isError || !goalCategory.data ? (
          <p className="text-sm text-gray-400">데이터가 없습니다</p>
        ) : goalCategory.data.slices.length === 0 ? (
          <p className="text-sm text-gray-400">기록된 Task가 없습니다</p>
        ) : (
          <GoalCategoryBarChart slices={goalCategory.data.slices} totalMinutes={goalCategory.data.totalMinutes} />
        )}
      </SectionWrapper>

      {/* 7-2-1: 목표 카테고리 */}
      <SectionWrapper title="목표 카테고리">
        {goalDetail.isPending ? (
          <ChartSkeleton />
        ) : goalDetail.isError || !goalDetail.data ? (
          <p className="text-sm text-gray-400">데이터가 없습니다</p>
        ) : goalDetail.data.length === 0 ? (
          <p className="text-sm text-gray-400">기록된 Task가 없습니다</p>
        ) : (
          <GoalCategoryDetailChart data={goalDetail.data} />
        )}
      </SectionWrapper>

      {/* 7-3-1: 일반 카테고리 */}
      <SectionWrapper title="일반 카테고리">
        {generalCategory.isPending ? (
          <ChartSkeleton />
        ) : generalCategory.isError || !generalCategory.data ? (
          <p className="text-sm text-gray-400">데이터가 없습니다</p>
        ) : generalCategory.data.slices.length === 0 ? (
          <p className="text-sm text-gray-400">기록된 Task가 없습니다</p>
        ) : (
          <GeneralCategoryDonutChart
            slices={generalCategory.data.slices}
            totalMinutes={generalCategory.data.totalMinutes}
          />
        )}
      </SectionWrapper>

      <SectionWrapper title="계획 달성률" subtitle="계획 시간과 실제 시간이 50% 이상 일치한 Task 기준">
        {achievement.isPending ? (
          <ChartSkeleton />
        ) : achievement.isError || !achievement.data ? (
          <EmptyState message="데이터가 없습니다" />
        ) : (
          <AchievementDonutChart data={achievement.data} />
        )}
      </SectionWrapper>
    </div>
  )
}
