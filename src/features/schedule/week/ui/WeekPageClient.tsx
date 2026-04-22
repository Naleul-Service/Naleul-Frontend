// WeekPageClient.tsx (새로 만들기)
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { WeekTaskList } from '@/src/features/schedule/week/ui/WeekTaskList'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'

interface WeekPageClientProps {
  date: Date
}

export function WeekPageClient({ date }: WeekPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <main>
      <WeekTaskList date={date} />

      <div className="fixed right-4 bottom-6">
        <Button size="lg" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          할 일 추가
        </Button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={todayStr} />
    </main>
  )
}
