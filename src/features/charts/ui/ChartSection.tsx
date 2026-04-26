'use client'

import { useGoalCategoryChart } from '../hooks/useGoalCategoryChart'
import { useGoalCategoryDetailChart } from '../hooks/useGoalCategoryDetailChart'
import { useGeneralCategoryChart } from '../hooks/useGeneralCategoryChart'
import { GoalCategoryBarChart } from './GoalCategoryBarChart'
import { GoalCategoryDetailChart } from './GoalCategoryDetailChart'
import { GeneralCategoryDonutChart } from './GeneralCategoryDonutChart'
import { useAchievementChart } from '@/src/features/charts/hooks/useAchievementChart'
import { AchievementDonutChart } from '@/src/features/charts/ui/AchievementDonutChart'
import PageHeader from '@/src/components/layout/PageHeader'
import { formatMinutes } from '@/src/features/charts/constants'
import Badge from '@/src/components/common/Badge'

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
    <section className="flex flex-col gap-4 rounded-[12px] border border-gray-100 bg-white p-5">
      <div className="flex flex-col gap-0.5">
        <h2 className="h3">{title}</h2>
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
    // 부모 컨테이너: gap-5로 사이 간격을 유지합니다.
    <div className="flex flex-col gap-y-[20px] bg-gray-50 p-[32px]">
      <PageHeader title={'리포트'} subtitle={'시간 사용 현황을 한 눈에 확인하세요'} />
      <section className="flex gap-x-4">
        <div className="flex h-[132px] w-full flex-col gap-y-3 rounded-[12px] border border-gray-100 bg-white px-6 py-5">
          <p className="label-md text-gray-400">총 소요 시간</p>
          <h1 className="display-lg text-[#0D4556]">{formatMinutes(goalCategory.data?.totalMinutes)}</h1>
        </div>
        <div className="flex h-[132px] w-full flex-col gap-y-3 rounded-[12px] border border-gray-100 bg-white px-6 py-5">
          <div className="flex items-center gap-x-1">
            <p className="label-md text-gray-400">계획 달성률</p>
            <Badge bgColor={'#C4DDE3'} textColor={'#0D4556'}>
              50% 일치 수준
            </Badge>
          </div>

          <div className="flex items-end gap-x-1">
            <h1 className="display-lg text-[#0D4556]">{achievement.data?.achievementRate}%</h1>
            <p className="label-sm mb-1 text-gray-300">
              {achievement.data?.achievedCount} / {achievement.data?.totalCount} Task
            </p>
          </div>
        </div>
        <div className="flex h-[132px] w-full flex-col gap-y-3 rounded-[12px] border border-gray-100 bg-white px-6 py-5">
          <p className="label-md text-gray-400">총 목표</p>
          <h1 className="display-lg">{goalDetail.data?.length}개</h1>
        </div>
      </section>
      <section className="flex gap-5">
        {/* 왼쪽 섹션 (2/3 비율) */}
        <section className="flex flex-[2] flex-col gap-y-[20px]">
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
        </section>

        {/* 오른쪽 섹션 (1/3 비율) */}
        <div className="flex flex-[1] flex-col gap-y-[20px]">
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
      </section>
    </div>
  )
}
