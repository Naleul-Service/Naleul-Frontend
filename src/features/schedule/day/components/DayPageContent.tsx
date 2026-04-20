'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString, toDayOfWeek } from '@/src/features/schedule/day/utils/day'

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const tableParams = {
    date: toDateString(selectedDate),
    dayOfWeek: toDayOfWeek(selectedDate),
  }

  return (
    <main className="flex flex-col gap-4">
      {/*
       * 두 컴포넌트를 하나의 스크롤 컨테이너로 감쌈
       * → 스크롤할 때 행 높이가 항상 맞아떨어짐
       */}
      <div className="flex w-full overflow-y-auto" style={{ maxHeight: 'calc(100svh - 120px)' }}>
        {/* DayTaskList — 좌측 50% */}
        <div className="w-1/2 shrink-0">
          <DayTaskList date={selectedDate} />
        </div>

        {/* DailyTimeTable — 우측 50% */}
        <div className="w-1/2 shrink-0">
          <DailyTimeTable params={tableParams} />
        </div>
      </div>

      <div className="fixed right-4 bottom-6">
        <Button size="lg" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          할 일 추가
        </Button>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDate={`${toDateString(selectedDate)}T09:00`}
      />
    </main>
  )
}
