import { TaskChip } from './TaskChip'
import { Task } from '@/src/features/schedule/day/types'

const MAX_VISIBLE = 3

interface Props {
  date: Date
  tasks: Task[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function CalendarCell({ date, tasks, isCurrentMonth, isToday }: Props) {
  const visibleTasks = tasks.slice(0, MAX_VISIBLE)
  const overflowCount = tasks.length - MAX_VISIBLE

  return (
    <div
      className={[
        'min-h-[90px] border-r border-b border-gray-200 bg-white p-1.5',
        isCurrentMonth ? '' : 'opacity-40',
      ].join(' ')}
    >
      {/* 날짜 숫자 */}
      <span
        className={[
          'mb-1 flex h-[22px] w-[22px] items-center justify-center rounded-full text-xs font-medium',
          isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
        ].join(' ')}
      >
        {date.getDate()}
      </span>

      {/* 할 일 칩 */}
      <div className="flex flex-col gap-[2px]">
        {visibleTasks.map((task) => (
          <TaskChip key={task.taskId} task={task} />
        ))}

        {overflowCount > 0 && <span className="text-muted-foreground px-1 text-[10px]">+{overflowCount}개</span>}
      </div>
    </div>
  )
}
