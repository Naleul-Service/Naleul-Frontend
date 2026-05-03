'use client'

import { WeeklyActualsResponse, WeeklyTasksResponse } from '../../types'
import { WeekTimeTable } from '../WeekTimeTable'
import { formatLocalDate } from '@/src/lib/datetime'
import { DaySection } from '@/src/features/schedule/week/ui/DaySection'

const DAY_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}
const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

interface DesktopWeekLayoutProps {
  taskData: WeeklyTasksResponse
  actualData: WeeklyActualsResponse
  startDate: string
  isPending: boolean
  isError: boolean
  visibleDays: string[]
}

export function DesktopWeekLayout({
  taskData,
  actualData,
  startDate,
  isPending,
  isError,
  visibleDays,
}: DesktopWeekLayoutProps) {
  return (
    <div className="flex flex-col gap-4">
      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      <div className="flex gap-4">
        <div className="w-64 shrink-0">
          {visibleDays.map((day) => {
            const tasks = taskData.tasksByDay[day] ?? []
            const actuals = actualData.actualsByDay[day] ?? []
            const dayOffset = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].indexOf(
              day
            )
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

        <div className="min-w-0 flex-1 overflow-x-auto">
          <WeekTimeTable taskData={taskData} actualData={actualData} startDate={startDate} />
        </div>
      </div>
    </div>
  )
}
