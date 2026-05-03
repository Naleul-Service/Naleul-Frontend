'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { cn } from '@/src/lib/utils'

type MobileTab = 'schedule' | 'timeline'

const MOBILE_TABS: { key: MobileTab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'timeline', label: '타임라인' },
]

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate)
  const { filter } = useTaskFilter()
  const [mobileTab, setMobileTab] = useState<MobileTab>('schedule')

  const tableParams = { date: dateString }

  return (
    <main className="flex flex-col gap-4">
      {/* 모바일 탭 */}
      <div className="tablet:hidden desktop:hidden flex border-b border-gray-100">
        {MOBILE_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMobileTab(key)}
            className={cn(
              'flex-1 pb-2 text-sm font-medium transition-colors',
              mobileTab === key ? 'border-b-2 border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-500'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 데스크탑 — 2컬럼 */}
      <div
        className="tablet:grid desktop:grid hidden w-full gap-x-[32px] overflow-y-auto px-1"
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

      {/* 모바일 — 탭별 단일 컬럼 */}
      <div className="tablet:hidden desktop:hidden">
        {mobileTab === 'schedule' && <DayTaskList filter={filter} date={selectedDate} />}
        {mobileTab === 'timeline' && <DailyTimeTable params={tableParams} />}
      </div>
    </main>
  )
}
