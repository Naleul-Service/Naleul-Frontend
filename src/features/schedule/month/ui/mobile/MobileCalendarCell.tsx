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

export function MobileCalendarCell({ date, tasks, isCurrentMonth, isToday }: Props) {
  const router = useRouter()

  return (
    <div
      className="cursor-pointer bg-white hover:bg-gray-50"
      style={{ aspectRatio: '1 / 1.6', maxHeight: 150, padding: 2 }}
      onClick={() => router.push(`/schedule?date=${toDateString(date)}`)}
    >
      <div className={`${!isCurrentMonth ? 'opacity-30' : ''} flex flex-col gap-y-[2px]`}>
        <span
          className={[
            'mx-auto mb-[1px] flex items-center justify-center rounded-full',
            isToday ? 'bg-primary text-primary-foreground' : 'text-gray-500',
          ].join(' ')}
          style={{ fontSize: 9, fontWeight: 500, width: 16, height: 16 }}
        >
          {date.getDate()}
        </span>
        <div className="flex flex-col" style={{ gap: 1 }}>
          {tasks.slice(0, MAX_VISIBLE).map((task) => (
            <TaskChip key={task.taskId} task={task} mobile />
          ))}
          {tasks.length > MAX_VISIBLE && (
            <span style={{ fontSize: 8, color: '#9CA3AF' }}>+{tasks.length - MAX_VISIBLE}</span>
          )}
        </div>
      </div>
    </div>
  )
}
