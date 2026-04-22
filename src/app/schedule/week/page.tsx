// WeekPage.tsx (서버 컴포넌트 유지)

import { WeekPageClient } from '@/src/features/schedule/week/ui/WeekPageClient'

interface WeekPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function WeekPage({ searchParams }: WeekPageProps) {
  const { date } = await searchParams
  const today = new Date().toISOString().split('T')[0]
  const dateStr = date ?? today
  const dateObj = new Date(dateStr)

  return <WeekPageClient date={dateObj} />
}
