import { TaskChip } from './TaskChip'
import { Task } from '@/src/features/schedule/day/types'
import { useRouter } from 'next/navigation'

const MAX_VISIBLE = 3

interface Props {
  date: Date
  tasks: Task[]
  isCurrentMonth: boolean
  isToday: boolean
}

export function CalendarCell({ date, tasks, isCurrentMonth, isToday }: Props) {
  const router = useRouter()

  const handleDateClick = () => {
    // 1. 로컬 시간 기준으로 연, 월, 일 추출
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0')

    const dateString = `${year}-${month}-${day}` // 2026-04-22 형식

    router.push(`/schedule?date=${dateString}`)
  }
  const visibleTasks = tasks.slice(0, MAX_VISIBLE)
  const overflowCount = tasks.length - MAX_VISIBLE

  return (
    <div className="h-[150px] border-r border-b border-gray-100 bg-white p-2">
      <div className={!isCurrentMonth ? 'opacity-40' : ''} onClick={handleDateClick}>
        {/* 날짜 숫자 */}
        <span
          className={[
            'label-sm mb-1 flex h-[24px] w-[24px] items-center justify-center rounded-full text-gray-500',
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
          {overflowCount > 0 && (
            <span className="text-muted-foreground label-xs mt-[4px] px-1">+{overflowCount}개</span>
          )}
        </div>
      </div>
    </div>
  )
}
