'use client'

import { useSearchParams } from 'next/navigation'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate) // 공통으로 사용할 날짜 문자열
  const { filter } = useTaskFilter()

  const tableParams = {
    date: dateString,
  }

  return (
    <main className="flex flex-col gap-4">
      <div
        className="grid w-full gap-x-[32px] overflow-y-auto px-1"
        style={{
          maxHeight: 'calc(100svh - 120px)',
          gridTemplateColumns: '2fr 3fr',
        }}
      >
        <div className="min-w-0">
          <DayTaskList filter={filter} date={selectedDate} />
        </div>
        <div className="min-w-0">
          <DailyTimeTable params={tableParams} />
        </div>
      </div>
    </main>
  )
}
