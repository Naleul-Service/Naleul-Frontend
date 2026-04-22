import { Suspense } from 'react'
import { DayPageContent } from '@/src/features/schedule/day/components/DayPageContent'

export default function DayPage() {
  return (
    <Suspense fallback={<DayPageSkeleton />}>
      <DayPageContent />
    </Suspense>
  )
}

function DayPageSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-muted h-14 animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
