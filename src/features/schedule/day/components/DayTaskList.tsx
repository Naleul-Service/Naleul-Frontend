'use client'

import { useMemo } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useTaskFilter } from '../hooks/useTaskFilter'
import { TaskFilterBar } from './TaskFilterBar'
import { TaskItem } from './TaskItem'
import { formatLocalDate } from '@/src/lib/datetime'

interface DayTaskListProps {
  date: Date
}

export function DayTaskList({ date }: DayTaskListProps) {
  const { filter, setPriority, setGoalCategory, setGeneralCategory } = useTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()

  const params = useMemo(
    () => ({
      date: formatLocalDate(date),
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
