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
import GoalStatsItem from '@/src/components/common/StatsSummary'
import { Button } from '@/src/components/common/Button'
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'

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
    <section className="flex flex-col gap-y-[6px] rounded-[12px] border border-gray-100 bg-white p-5">
      <div className="flex flex-col gap-y-1">
        <h2 className="h4">{title}</h2>
        {subtitle && <p className="body-sm text-[#8FA0A8]">{subtitle}</p>}
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const todayString = new Date().toISOString().split('T')[0]

  const goalCategory = useGoalCategoryChart()
  const goalDetail = useGoalCategoryDetailChart()
  const generalCategory = useGeneralCategoryChart()
  const achievement = useAchievementChart()

  return (
    // 부모 컨테이너: gap-5로 사이 간격을 유지합니다.
    <div className="flex flex-col gap-y-[20px] p-5">
      <PageHeader
        title={'홈'}
        subtitle={'시간 사용 현황을 한 눈에 확인하세요'}
        rightElement={
          <div className="flex gap-x-2">
            <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon size={16} />} size={'md'}>
              할 일 추가
            </Button>
          </div>
        }
      />
      <div className="flex flex-col gap-y-[20px]">
        <section className="flex gap-x-4">
          <GoalStatsItem title="총 소요 시간" content={`${formatMinutes(goalCategory.data?.totalMinutes)}`} />
          <GoalStatsItem
            title="계획 달성률"
            badge={
              <Badge bgColor={'#C4DDE3'} textColor={'#0D4556'}>
                50% 일치 수준
              </Badge>
            }
            content={`${achievement.data?.achievementRate}%`}
            indicator={`${achievement.data?.achievedCount} / ${achievement.data?.totalCount} Task`}
          />
          <GoalStatsItem title="총 목표" content={`${goalDetail.data?.length} 개`} />
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

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${todayString}T09:00`} />
      </div>
    </div>
  )
}
