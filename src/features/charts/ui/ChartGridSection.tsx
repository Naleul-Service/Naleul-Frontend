// src/features/charts/ui/ChartGridSection.tsx

import { GoalCategoryBarChart } from './GoalCategoryBarChart'
import { GoalCategoryDetailChart } from './GoalCategoryDetailChart'
import { GeneralCategoryDonutChart } from './GeneralCategoryDonutChart'
import { AchievementDonutChart } from './AchievementDonutChart'
import { ChartStateWrapper } from './ChartStateWrapper'
import type { useChartData } from '../hooks/useChartData'
import SectionWrapper from '@/src/features/charts/ui/SectionWrapper'

type ChartData = ReturnType<typeof useChartData>

export function ChartGridSection({ goalCategory, goalDetail, generalCategory, achievement }: ChartData) {
  return (
    <section className="desktop:gap-5 desktop:flex-row tablet:gap-5 flex flex-col gap-3">
      {/* 왼쪽 */}
      <div className="desktop:gap-y-[20px] tablet:gap-5 flex flex-[2] flex-col gap-y-3">
        <SectionWrapper title="전체 카테고리">
          <ChartStateWrapper
            isPending={goalCategory.isPending}
            isError={goalCategory.isError}
            isEmpty={!goalCategory.data?.slices.length}
          >
            {() => (
              <GoalCategoryBarChart slices={goalCategory.data!.slices} totalMinutes={goalCategory.data!.totalMinutes} />
            )}
          </ChartStateWrapper>
        </SectionWrapper>

        <SectionWrapper title="목표 카테고리">
          <ChartStateWrapper
            isPending={goalDetail.isPending}
            isError={goalDetail.isError}
            isEmpty={!goalDetail.data?.length}
          >
            {() => <GoalCategoryDetailChart data={goalDetail.data!} />}
          </ChartStateWrapper>
        </SectionWrapper>
      </div>

      {/* 오른쪽 */}
      <div className="desktop:flex-col tablet:flex-row flex w-full flex-[1] flex-col gap-[20px]">
        <SectionWrapper title="세부 목표 카테고리">
          <ChartStateWrapper
            isPending={generalCategory.isPending}
            isError={generalCategory.isError}
            isEmpty={!generalCategory.data?.slices.length}
          >
            {() => (
              <GeneralCategoryDonutChart
                slices={generalCategory.data!.slices}
                totalMinutes={generalCategory.data!.totalMinutes}
              />
            )}
          </ChartStateWrapper>
        </SectionWrapper>

        <SectionWrapper title="계획 달성률" subtitle="계획 시간과 실제 시간이 50% 이상 일치한 Task 기준">
          <ChartStateWrapper
            isPending={achievement.isPending}
            isError={achievement.isError}
            isEmpty={!achievement.data}
          >
            {() => <AchievementDonutChart data={achievement.data!} />}
          </ChartStateWrapper>
        </SectionWrapper>
      </div>
    </section>
  )
}
