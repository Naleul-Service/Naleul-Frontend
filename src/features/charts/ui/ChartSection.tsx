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

  const isAnyLoading =
    goalCategory.isPending || goalDetail.isPending || generalCategory.isPending || achievement.isPending

  return (
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
        {/* 통계 요약 */}
        <section className="flex gap-x-4">
          <GoalStatsItem
            title="총 소요 시간"
            content={goalCategory.isPending ? '-' : formatMinutes(goalCategory.data?.totalMinutes ?? 0)}
          />
          <GoalStatsItem
            title="계획 달성률"
            badge={
              <Badge bgColor={'#C4DDE3'} textColor={'#0D4556'}>
                50% 일치 수준
              </Badge>
            }
            content={achievement.isPending ? '-' : `${achievement.data?.achievementRate ?? 0}%`}
            indicator={
              achievement.isPending
                ? '-'
                : `${achievement.data?.achievedCount ?? 0} / ${achievement.data?.totalCount ?? 0} Task`
            }
          />
          <GoalStatsItem title="총 목표" content={goalDetail.isPending ? '-' : `${goalDetail.data?.length ?? 0} 개`} />
        </section>

        <section className="flex gap-5">
          {/* 왼쪽 */}
          <section className="flex flex-[2] flex-col gap-y-[20px]">
            <SectionWrapper title="전체 카테고리">
              {goalCategory.isPending ? (
                <ChartSkeleton />
              ) : goalCategory.isError ? (
                <EmptyState message="데이터를 불러오지 못했습니다" />
              ) : !goalCategory.data || goalCategory.data.slices.length === 0 ? (
                <EmptyState message="기록된 Task가 없습니다" />
              ) : (
                <GoalCategoryBarChart slices={goalCategory.data.slices} totalMinutes={goalCategory.data.totalMinutes} />
              )}
            </SectionWrapper>

            <SectionWrapper title="목표 카테고리">
              {goalDetail.isPending ? (
                <ChartSkeleton />
              ) : goalDetail.isError ? (
                <EmptyState message="데이터를 불러오지 못했습니다" />
              ) : !goalDetail.data || goalDetail.data.length === 0 ? (
                <EmptyState message="기록된 Task가 없습니다" />
              ) : (
                <GoalCategoryDetailChart data={goalDetail.data} />
              )}
            </SectionWrapper>
          </section>

          {/* 오른쪽 */}
          <div className="flex flex-[1] flex-col gap-y-[20px]">
            <SectionWrapper title="일반 카테고리">
              {generalCategory.isPending ? (
                <ChartSkeleton />
              ) : generalCategory.isError ? (
                <EmptyState message="데이터를 불러오지 못했습니다" />
              ) : !generalCategory.data || generalCategory.data.slices.length === 0 ? (
                <EmptyState message="기록된 Task가 없습니다" />
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
              ) : achievement.isError ? (
                <EmptyState message="데이터를 불러오지 못했습니다" />
              ) : !achievement.data ? (
                <EmptyState message="기록된 Task가 없습니다" />
              ) : (
                <AchievementDonutChart data={achievement.data} />
              )}
            </SectionWrapper>
          </div>
        </section>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${todayString}T09:00`} />
    </div>
  )
}
