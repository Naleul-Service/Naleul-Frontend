import { WeekTaskList } from '@/src/features/schedule/week/ui/WeekTaskList'

interface WeekPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function WeekPage({ searchParams }: WeekPageProps) {
  const { date } = await searchParams
  const today = new Date().toISOString().split('T')[0]
  const dateStr = date ?? today
  const dateObj = new Date(dateStr)

  return (
    <main>
      <WeekTaskList date={dateObj} />
    </main>
  )
}
