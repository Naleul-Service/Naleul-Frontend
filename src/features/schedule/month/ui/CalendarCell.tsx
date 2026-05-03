'use client'

import { TaskChip } from './TaskChip'
import { useRouter } from 'next/navigation'
import { Task } from '@/src/features/task/types'

const MAX_VISIBLE_DESKTOP = 3
const MAX_VISIBLE_MOBILE = 3

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

export function CalendarCell({ date, tasks, isCurrentMonth, isToday }: Props) {
  const router = useRouter()

  function handleDateClick() {
    router.push(`/schedule?date=${toDateString(date)}`)
  }

  return (
    <div className="cursor-pointer bg-white hover:bg-gray-50" onClick={handleDateClick}>
      <style>{`
        @media (min-width: 768px) {
          .cal-desktop { display: grid !important; }
          .cal-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .cal-desktop { display: none !important; }
          .cal-mobile { display: grid !important; }
        }
      `}</style>
      <div className={!isCurrentMonth ? 'opacity-30' : ''}>
        {/* 데스크탑 */}
        <div className="tablet:block hidden p-2" style={{ aspectRatio: '1 / 1.2', maxHeight: 150 }}>
          <span
            className={[
              'label-sm mb-1 flex h-[24px] w-[24px] items-center justify-center rounded-full',
              isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground',
            ].join(' ')}
          >
            {date.getDate()}
          </span>
          <div className="flex flex-col gap-[2px]">
            {tasks.slice(0, MAX_VISIBLE_DESKTOP).map((task) => (
              <TaskChip key={task.taskId} task={task} />
            ))}
            {tasks.length > MAX_VISIBLE_DESKTOP && (
              <span className="text-muted-foreground label-xs mt-[4px] px-1">
                +{tasks.length - MAX_VISIBLE_DESKTOP}개
              </span>
            )}
          </div>
        </div>

        {/* 모바일 */}
        <div className="tablet:hidden block" style={{ aspectRatio: '1 / 1.6', maxHeight: 150, padding: 2 }}>
          <span
            className={[
              'mx-auto mb-[1px] flex items-center justify-center rounded-full',
              isToday ? 'bg-primary text-primary-foreground' : 'text-gray-500',
            ].join(' ')}
            style={{
              fontSize: 9,
              fontWeight: 500,
              width: 16,
              height: 16,
            }}
          >
            {date.getDate()}
          </span>
          <div className="flex flex-col" style={{ gap: 1 }}>
            {tasks.slice(0, MAX_VISIBLE_MOBILE).map((task) => (
              <TaskChip key={task.taskId} task={task} mobile />
            ))}
            {tasks.length > MAX_VISIBLE_MOBILE && (
              <span style={{ fontSize: 8, color: '#9CA3AF' }}>+{tasks.length - MAX_VISIBLE_MOBILE}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
