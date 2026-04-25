'use client'

import { useMemo } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useWeeklyTasks } from '../hooks/useWeeklyTasks'
import { useWeekRange } from '../hooks/useWeekRange'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { TaskFilterBar } from '@/src/features/schedule/day/components/TaskFilterBar'
import { TaskItem } from '@/src/features/schedule/day/components/TaskItem'
import { WeekTimeTable } from '@/src/features/schedule/week/ui/WeekTimeTable'
import { useWeeklyActuals } from '@/src/features/schedule/week/hooks/useWeeklyActuals'
import { formatLocalDate } from '@/src/lib/datetime'

const DAY_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}
const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

interface WeekTaskListProps {
  date: Date
}

export function WeekTaskList({ date }: WeekTaskListProps) {
  const { filter, dayOfWeek, setPriority, setGoalCategory, setGeneralCategory, setDayOfWeek } = useTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()
  const { startDate, endDate } = useWeekRange(date)

  const taskParams = useMemo(
    () => ({
      startDate,
      endDate,
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.goalCategoryId != null && { goalCategoryId: filter.goalCategoryId }),
      ...(filter.generalCategoryId != null && { generalCategoryId: filter.generalCategoryId }),
      ...(dayOfWeek && { dayOfWeek }),
    }),
    [startDate, endDate, filter, dayOfWeek]
  )

  const actualParams = useMemo(
    () => ({
      startDate,
      endDate,
      ...(filter.goalCategoryId != null && { goalCategoryId: filter.goalCategoryId }),
      ...(filter.generalCategoryId != null && { generalCategoryId: filter.generalCategoryId }),
    }),
    [startDate, endDate, filter]
  )

  const { data: taskData, isPending: isTaskPending, isError: isTaskError } = useWeeklyTasks(taskParams)
  const { data: actualData, isPending: isActualPending } = useWeeklyActuals(actualParams)

  const isPending = isTaskPending || isActualPending
  const isError = isTaskError
  const visibleDays = dayOfWeek ? [dayOfWeek] : DAY_ORDER

  return (
    <div className="flex flex-col gap-4">
      <TaskFilterBar
        filter={filter}
        goalCategories={goalCategories}
        onPriorityChange={setPriority}
        onGoalCategoryChange={setGoalCategory}
        onGeneralCategoryChange={setGeneralCategory}
      />

      {/* 요일 필터 */}
      <div className="flex gap-1.5">
        {DAY_ORDER.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setDayOfWeek(dayOfWeek === day ? undefined : day)}
            className={[
              'h-7 flex-1 rounded-md text-xs font-medium transition-colors',
              dayOfWeek === day
                ? 'bg-foreground text-background'
                : 'border-border text-muted-foreground hover:bg-muted border',
            ].join(' ')}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      <div className="flex gap-4">
        {/* 태스크 리스트 */}
        {taskData && (
          <div className="flex w-64 shrink-0 flex-col gap-6">
            {visibleDays.map((day) => {
              const tasks = taskData.tasksByDay[day] ?? []
              const dayOffset = DAY_ORDER.indexOf(day)
              const dayDate = new Date(startDate)
              dayDate.setDate(dayDate.getDate() + dayOffset)
              const dateStr = formatLocalDate(dayDate)

              return (
                <div key={day}>
                  <p className="text-muted-foreground mb-2 text-xs font-medium">
                    {DAY_LABELS[day]}요일
                    {tasks.length > 0 && <span className="ml-1.5">({tasks.length})</span>}
                  </p>
                  {tasks.length === 0 ? (
                    <p className="text-muted-foreground text-xs">할 일이 없어요</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {tasks.map((task) => (
                        <TaskItem key={task.taskId} task={task} date={dateStr} />
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* 주간 타임테이블 — 두 데이터 모두 로드된 후 렌더 */}
        {taskData && actualData && (
          <div className="min-w-0 flex-1 overflow-x-auto">
            <WeekTimeTable taskData={taskData} actualData={actualData} startDate={startDate} />
          </div>
        )}
      </div>
    </div>
  )
}
