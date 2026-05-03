import { Task } from '@/src/features/task/types'
import { buildCalendarGrid, getDayStatus, toDateKey } from '../utils/calendar'

interface Props {
  year: number
  month: number
  tasksByDate: Record<string, Task[]>
}

const CELL_SIZE = 14

export function MonthHeatmap({ year, month, tasksByDate }: Props) {
  const weeks = buildCalendarGrid(year, month)

  return (
    <div className="flex flex-col gap-[3px]">
      {Array.from({ length: 7 }, (_, dayIdx) => (
        <div key={dayIdx} className="flex gap-[3px]">
          {weeks.map((week, weekIdx) => {
            const date = week[dayIdx]

            if (!date) {
              return <div key={weekIdx} style={{ width: CELL_SIZE, height: CELL_SIZE }} />
            }

            const key = toDateKey(date)
            const tasks = tasksByDate[key] ?? []
            const status = getDayStatus(tasks)

            return (
              <div
                key={key}
                title={`${date.getDate()}일 ${status.completed ? '완료' : '미완료'}`}
                className="flex-shrink-0 rounded-sm transition-opacity hover:opacity-70"
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: status.completed ? (status.color ?? '#6495ED') : 'var(--color-background-secondary)',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
