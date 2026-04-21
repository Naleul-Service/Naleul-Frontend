'use client'

import { useMemo } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useTaskFilter } from '../hooks/useTaskFilter'
import { TaskFilterBar } from './TaskFilterBar'
import { TaskItem } from './TaskItem'

const DAY_OF_WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

interface DayTaskListProps {
  date: Date
}

export function DayTaskList({ date }: DayTaskListProps) {
  const { filter, setPriority, setGoalCategory, setGeneralCategory } = useTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()

  // useMemo로 params 안정화 — date, filter 바뀔 때만 새 객체 생성
  const params = useMemo(
    () => ({
      date: date.toISOString().split('T')[0],
      dayOfWeek: DAY_OF_WEEK[date.getDay()],
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.goalCategoryId != null && { goalCategoryId: filter.goalCategoryId }),
      ...(filter.generalCategoryId != null && { generalCategoryId: filter.generalCategoryId }),
    }),
    [date, filter]
  )

  const { data, isPending, isError } = useDailyTasks(params)

  return (
    <div className="flex flex-col gap-4">
      <TaskFilterBar
        filter={filter}
        goalCategories={goalCategories}
        onPriorityChange={setPriority}
        onGoalCategoryChange={setGoalCategory}
        onGeneralCategoryChange={setGeneralCategory}
      />

      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}
      {!isPending && !isError && !data?.tasks.length && (
        <p className="text-muted-foreground text-sm">등록된 할 일이 없어요</p>
      )}

      {data?.tasks && (
        <ul className="flex flex-col gap-2">
          {data.tasks.map((task) => (
            <TaskItem key={task.taskId} task={task} date={params.date} />
          ))}
        </ul>
      )}
    </div>
  )
}
