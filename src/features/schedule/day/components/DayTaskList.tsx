'use client'

import { useMemo, useState } from 'react'
import { useDailyTasks } from '../hooks/useDailyTasks'
import { useDailyActuals } from '../hooks/useDailyActuals'
import { TaskFilterState } from '../types'
import { TaskItem } from './TaskItem'
import { ActualTaskItem } from './ActualTaskItem'
import { formatLocalDate } from '@/src/lib/datetime'
import { cn } from '@/src/lib/utils'

interface DayTaskListProps {
  date: Date
  filter: TaskFilterState
}

type Tab = 'planned' | 'done' | 'actual'

const TABS: { key: Tab; label: string }[] = [
  { key: 'planned', label: '계획' },
  { key: 'done', label: '완료' },
  { key: 'actual', label: '실제 기록' },
]

export function DayTaskList({ date, filter }: DayTaskListProps) {
  const [activeTab, setActiveTab] = useState<Tab>('planned')
  const dateString = formatLocalDate(date)

  const params = useMemo(
    () => ({
      date: dateString,
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.goalCategoryId != null && { goalCategoryId: filter.goalCategoryId }),
      ...(filter.generalCategoryId != null && { generalCategoryId: filter.generalCategoryId }),
    }),
    [dateString, filter]
  )

  const { data: tasks, isPending: isTasksPending, isError: isTasksError } = useDailyTasks(params)
  const { data: actuals, isPending: isActualsPending, isError: isActualsError } = useDailyActuals({ date: dateString })

  const plannedTasks = useMemo(() => tasks?.filter((t) => t.actual === null) ?? [], [tasks])
  const doneTasks = useMemo(() => tasks?.filter((t) => t.actual !== null) ?? [], [tasks])

  const isPending = isTasksPending || isActualsPending
  const isError = isTasksError || isActualsError

  return (
    <div className="flex flex-col gap-3">
      {/* 탭 바 */}
      <div className="flex border-b border-gray-100">
        {TABS.map(({ key, label }) => {
          const count =
            key === 'planned' ? plannedTasks.length : key === 'done' ? doneTasks.length : (actuals?.length ?? 0)

          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                'flex items-center gap-1.5 px-3 pb-2 text-sm font-medium transition-colors',
                activeTab === key ? 'border-b-2 border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-500'
              )}
            >
              {label}
              {!isPending && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-xs',
                    activeTab === key ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-400'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 콘텐츠 */}
      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      {!isPending && !isError && (
        <>
          {activeTab === 'planned' && (
            <ul className="flex flex-col gap-2">
              {!plannedTasks.length ? (
                <p className="text-muted-foreground text-sm">계획된 할 일이 없어요</p>
              ) : (
                plannedTasks.map((task) => <TaskItem key={task.taskId} task={task} date={params.date} />)
              )}
            </ul>
          )}

          {activeTab === 'done' && (
            <ul className="flex flex-col gap-2">
              {!doneTasks.length ? (
                <p className="text-muted-foreground text-sm">완료된 할 일이 없어요</p>
              ) : (
                doneTasks.map((task) => <TaskItem key={task.taskId} task={task} date={params.date} />)
              )}
            </ul>
          )}

          {activeTab === 'actual' && (
            <ul className="flex flex-col gap-2">
              {!actuals?.length ? (
                <p className="text-muted-foreground text-sm">실제 기록이 없어요</p>
              ) : (
                actuals.map((actual) => <ActualTaskItem key={actual.taskActualId} actual={actual} />)
              )}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
