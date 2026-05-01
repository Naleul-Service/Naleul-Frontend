// app/(home)/HomePage.tsx  or  src/features/home/ui/HomePage.tsx
'use client'

import PageHeader from '@/src/components/layout/PageHeader'
import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'
import { useChartData } from '@/src/features/charts/hooks/useChartData'
import { StatsSummarySection } from '@/src/features/charts/ui/StatsSummarySection'
import { ChartGridSection } from '@/src/features/charts/ui/ChartGridSection'

export function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const todayString = new Date().toISOString().split('T')[0]
  const chartData = useChartData()

  return (
    <main className="desktop:p-5 mb-[60px] flex flex-col gap-y-[20px] px-4 py-3">
      <PageHeader
        title="홈"
        subtitle="시간 사용 현황을 한 눈에 확인하세요"
        rightElement={
          <Button onClick={() => setIsModalOpen(true)} leftIcon={<PlusIcon size={16} />} size="md">
            할 일 추가
          </Button>
        }
      />

      <div className="tablet:gap-y-5 flex flex-col gap-y-3">
        <StatsSummarySection
          goalCategory={chartData.goalCategory}
          goalDetail={chartData.goalDetail}
          achievement={chartData.achievement}
        />
        <ChartGridSection {...chartData} />
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${todayString}T09:00`} />
    </main>
  )
}
