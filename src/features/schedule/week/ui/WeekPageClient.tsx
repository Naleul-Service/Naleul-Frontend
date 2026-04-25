// WeekPageClient.tsx (새로 만들기)
'use client'

import { WeekTaskList } from '@/src/features/schedule/week/ui/WeekTaskList'

interface WeekPageClientProps {
  date: Date
}

export function WeekPageClient({ date }: WeekPageClientProps) {
  return (
    <main>
      <WeekTaskList date={date} />
    </main>
  )
}
