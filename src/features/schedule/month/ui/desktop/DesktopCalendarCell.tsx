'use client'

import { useRouter } from 'next/navigation'
import { Task } from '@/src/features/task/types'
import { TaskChip } from '@/src/features/schedule/month/ui/TaskChip'

const MAX_VISIBLE = 3

interface Props {
  date: Date
  tasks: Task[]
  isCurrentMonth: boolean
  isToday: boolean
}

function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function DesktopCalendarCell({ date, tasks, isCurrentMonth, isToday }: Props) {
  const router = useRouter()

  return (
    <div
      className="h-[150px] cursor-pointer border-r border-b border-gray-100 bg-white p-2 hover:bg-gray-50"
      onClick={() => router.push(`/schedule?date=${toDateString(date)}`)}
    >
      <div className={!isCurrentMonth ? 'opacity-30' : ''}>
        <span
          className={[
            'label-sm mb-1 flex h-[24px] w-[24px] items-center justify-center rounded-full',
            isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
          ].join(' ')}
        >
          {date.getDate()}
        </span>
        <div className="flex flex-col gap-[2px]">
          {tasks.slice(0, MAX_VISIBLE).map((task) => (
            <TaskChip key={task.taskId} task={task} />
          ))}
          {tasks.length > MAX_VISIBLE && (
            <span className="text-muted-foreground label-xs mt-[4px] px-1">+{tasks.length - MAX_VISIBLE}개</span>
          )}
        </div>
      </div>
    </div>
  )
}
