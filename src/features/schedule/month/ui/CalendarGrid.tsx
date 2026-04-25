import { buildCalendarDays, isSameMonth, isToday, toDateKey } from '../utils/calendar'
import { CalendarCell } from './CalendarCell'
import { Task } from '@/src/features/schedule/day/types'

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

interface Props {
  year: number
  month: number
  tasksByDate: Record<string, Task[]>
}

export function CalendarGrid({ year, month, tasksByDate }: Props) {
  const days = buildCalendarDays(year, month)

  return (
    <div className="overflow-hidden bg-white">
      <div className="grid h-[28px] grid-cols-7 items-center justify-center bg-gray-50">
        {DAY_LABELS.map((label) => (
          <div key={label} className="label-sm text-center text-gray-500">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border border-gray-100">
        {days.map((date) => {
          const key = toDateKey(date)
          return (
            <CalendarCell
              key={key}
              date={date}
              tasks={tasksByDate[key] ?? []}
              isCurrentMonth={isSameMonth(date, year, month)}
              isToday={isToday(date)}
            />
          )
        })}
      </div>
    </div>
  )
}
