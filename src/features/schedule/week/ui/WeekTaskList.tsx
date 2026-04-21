'use client'

import { useMemo } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useWeeklyTasks } from '../hooks/useWeeklyTasks'
import { useWeekRange } from '../hooks/useWeekRange'
import { useWeekTaskFilter } from '../hooks/useWeekTaskFilter'
import { TaskFilterBar } from '@/src/features/schedule/day/components/TaskFilterBar'
import { TaskItem } from '@/src/features/schedule/day/components/TaskItem'

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
  const { filter, dayOfWeek, setPriority, setGoalCategory, setGeneralCategory, setDayOfWeek } = useWeekTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()
  const { startDate, endDate } = useWeekRange(date)

  const params = useMemo(
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

  const { data, isPending, isError } = useWeeklyTasks(params)
  const visibleDays = dayOfWeek ? [dayOfWeek] : DAY_ORDER

  return (
    <div className="flex flex-col gap-4">
      {/* 필터바 */}
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

      {data && (
        <div className="flex flex-col gap-6">
          {visibleDays.map((day) => {
            const tasks = data.tasksByDay[day] ?? []
            const dayOffset = DAY_ORDER.indexOf(day)
            const dayDate = new Date(startDate)
            dayDate.setDate(dayDate.getDate() + dayOffset)
            const dateStr = dayDate.toISOString().split('T')[0]

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
    </div>
  )
}
