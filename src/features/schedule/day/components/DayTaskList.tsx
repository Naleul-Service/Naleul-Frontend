'use client'

// date → 'MONDAY' 등 변환 유틸

import { useDailyTasks } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { Task } from '@/src/features/schedule/day/types'

const DAY_OF_WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

function getDayOfWeek(date: Date): string {
  return DAY_OF_WEEK[date.getDay()]
}

interface DayTaskListProps {
  date: Date
}

export function DayTaskList({ date }: DayTaskListProps) {
  const params = {
    date: date.toISOString().split('T')[0], // 'yyyy-MM-dd'
    dayOfWeek: getDayOfWeek(date),
  }

  const { data, isPending, isError } = useDailyTasks(params)

  if (isPending) return <div className="text-muted-foreground text-sm">불러오는 중...</div>
  if (isError) return <div className="text-sm text-red-500">할 일을 불러오지 못했어요</div>
  if (!data?.tasks.length) return <div className="text-muted-foreground text-sm">등록된 할 일이 없어요</div>

  return (
    <ul className="flex flex-col gap-2">
      {data.tasks.map((task) => (
        <TaskItem key={task.taskId} task={task} />
      ))}
    </ul>
  )
}

function TaskItem({ task }: { task: Task }) {
  const start = new Date(task.plannedStartAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
  const end = new Date(task.plannedEndAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <li className="border-border flex items-center gap-3 rounded-lg border px-4 py-3">
      {/* 우선순위 뱃지 */}
      <span className="bg-foreground text-background flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
        {task.taskPriority}
      </span>

      {/* 내용 */}
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{task.taskName}</p>
        {task.goalCategoryName && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">{task.goalCategoryName}</p>
        )}
      </div>

      {/* 시간 */}
      <span className="text-muted-foreground shrink-0 text-xs">
        {start} ~ {end}
      </span>
    </li>
  )
}
