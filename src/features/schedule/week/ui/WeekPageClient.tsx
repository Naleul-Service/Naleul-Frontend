// WeekPageClient.tsx (새로 만들기)
'use client'

import { useState } from 'react'
import { WeekTaskList } from '@/src/features/schedule/week/ui/WeekTaskList'

interface WeekPageClientProps {
  date: Date
}

export function WeekPageClient({ date }: WeekPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <main>
      <WeekTaskList date={date} />
    </main>
  )
}
