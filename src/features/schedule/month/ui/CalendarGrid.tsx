'use client'

import { buildCalendarDays, isSameMonth, isToday, toDateKey } from '../utils/calendar'
import { Task } from '@/src/features/task/types'
import { DesktopCalendarCell } from '@/src/features/schedule/month/ui/desktop/DesktopCalendarCell'
import { MobileCalendarCell } from '@/src/features/schedule/month/ui/mobile/MobileCalendarCell'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface Props {
  year: number
  month: number
  tasksByDate: Record<string, Task[]>
}

export function CalendarGrid({ year, month, tasksByDate }: Props) {
  const days = buildCalendarDays(year, month)

  const cellProps = days.map((date) => ({
    date,
    key: toDateKey(date),
    tasks: tasksByDate[toDateKey(date)] ?? [],
    isCurrentMonth: isSameMonth(date, year, month),
    isToday: isToday(date),
  }))

  return (
    <div className="overflow-hidden rounded-t-[6px] bg-white">
      {/* 데스크탑 */}
      <div className="tablet:block hidden">
        <div className="grid h-[28px] grid-cols-7 items-center justify-center bg-gray-50">
          {DAY_LABELS.map((label) => (
            <div key={label} className="label-sm text-center text-gray-500">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-100">
          {cellProps.map((p) => (
            <DesktopCalendarCell
              key={p.key}
              date={p.date}
              tasks={p.tasks}
              isCurrentMonth={p.isCurrentMonth}
              isToday={p.isToday}
            />
          ))}
        </div>
      </div>

      {/* 모바일 */}
      <div className="tablet:hidden block">
        <div className="grid h-[22px] grid-cols-7 items-center bg-gray-50">
          {DAY_LABELS.map((label) => (
            <div key={label} className="py-[3px] text-center text-gray-500" style={{ fontSize: 9 }}>
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cellProps.map((p) => (
            <MobileCalendarCell
              key={p.key}
              date={p.date}
              tasks={p.tasks}
              isCurrentMonth={p.isCurrentMonth}
              isToday={p.isToday}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
