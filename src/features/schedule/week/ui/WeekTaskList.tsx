'use client'

import { useMemo } from 'react'
import { useWeeklyTasks } from '../hooks/useWeeklyTasks'
import { useWeekRange } from '../hooks/useWeekRange'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { useWeeklyActuals } from '@/src/features/schedule/week/hooks/useWeeklyActuals'
import { DesktopWeekLayout } from './desktop/DesktopWeekLayout'
import { MobileWeekLayout } from './mobile/MobileWeekLayout'

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

interface WeekTaskListProps {
  date: Date
}

export function WeekTaskList({ date }: WeekTaskListProps) {
  const { filter, dayOfWeek } = useTaskFilter()
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

  if (!taskData || !actualData) {
    return isPending ? <p className="text-muted-foreground text-sm">불러오는 중...</p> : null
  }

  return (
    <>
      {/* 데스크탑 */}
      <div className="tablet:block desktop:block hidden">
        <DesktopWeekLayout
          taskData={taskData}
          actualData={actualData}
          startDate={startDate}
          isPending={isPending}
          isError={isError}
          visibleDays={visibleDays}
        />
      </div>

      {/* 모바일 */}
      <div className="tablet:hidden desktop:hidden block">
        <MobileWeekLayout
          taskData={taskData}
          actualData={actualData}
          startDate={startDate}
          isPending={isPending}
          isError={isError}
        />
      </div>
    </>
  )
}
