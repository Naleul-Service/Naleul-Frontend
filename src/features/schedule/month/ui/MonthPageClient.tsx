// MonthPageClient.tsx
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { MonthCalendar } from '@/src/features/schedule/month/ui/MonthCalendar'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'

export function MonthPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className="p-4">
      <MonthCalendar />

      <div className="fixed right-4 bottom-6">
        <Button size="lg" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          할 일 추가
        </Button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${todayStr}T09:00`} />
    </div>
  )
}
