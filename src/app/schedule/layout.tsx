'use client'

import SchedulePageLayout from '@/src/features/schedule/day/components/SchedulePageLayout'

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <SchedulePageLayout>{children}</SchedulePageLayout>
    </main>
  )
}
