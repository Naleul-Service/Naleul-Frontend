'use client'

import { cn } from '@/src/lib/utils'
import { WeeklyActualsResponse, WeeklyTasksResponse } from '../../types'
import { MobileWeekTimeTable } from './MobileWeekTimeTable'
import { formatLocalDate } from '@/src/lib/datetime'
import { DaySection } from '@/src/features/schedule/week/ui/DaySection'
import { MobileTab } from '@/src/features/schedule/context/ScheduleHeaderContext'

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

const TABS: { key: MobileTab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'timeline', label: '타임라인' },
]

interface MobileWeekLayoutProps {
  taskData: WeeklyTasksResponse
  actualData: WeeklyActualsResponse
  startDate: string
  isPending: boolean
  isError: boolean
  mobileTab: MobileTab
  onTabChange: (tab: MobileTab) => void // 추가
  visibleDays: string[]
}

export function MobileWeekLayout({
  taskData,
  actualData,
  startDate,
  isPending,
  isError,
  mobileTab,
  onTabChange,
  visibleDays,
}: MobileWeekLayoutProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 태블릿 텍스트 탭 */}
      <div className="tablet:flex desktop:hidden hidden border-b border-gray-100">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            className={cn(
              'flex-1 pb-2 text-sm font-medium transition-colors',
              mobileTab === key ? 'border-b-2 border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-500'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      {!isPending && !isError && (
        <>
          {mobileTab === 'schedule' && (
            <div>
              {visibleDays.map((day) => {
                const tasks = taskData.tasksByDay[day] ?? []
                const actuals = actualData.actualsByDay[day] ?? []
                const dayOffset = DAY_ORDER.indexOf(day)
                const dayDate = new Date(startDate)
                dayDate.setDate(dayDate.getDate() + dayOffset)
                const dateStr = formatLocalDate(dayDate)
                const completedCount = tasks.filter((t) => t.actual !== null).length

                return (
                  <DaySection
                    key={day}
                    day={day}
                    dateStr={dateStr}
                    tasks={tasks}
                    actuals={actuals}
                    completedCount={completedCount}
                  />
                )
              })}
            </div>
          )}

          {mobileTab === 'timeline' && (
            <MobileWeekTimeTable taskData={taskData} actualData={actualData} startDate={startDate} />
          )}
        </>
      )}
    </div>
  )
}
