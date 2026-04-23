'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))

  const [isModalOpen, setIsModalOpen] = useState(false)

  const tableParams = {
    date: toDateString(selectedDate),
  }

  return (
    <main className="flex flex-col gap-4">
      <div className="flex w-full overflow-y-auto" style={{ maxHeight: 'calc(100svh - 120px)' }}>
        <div className="w-2/5 shrink-0">
          <DayTaskList date={selectedDate} />
        </div>
        <div className="w-3/5 shrink-0">
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
