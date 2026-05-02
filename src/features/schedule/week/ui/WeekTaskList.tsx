'use client'

import { useMemo, useState } from 'react'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { useWeeklyTasks } from '../hooks/useWeeklyTasks'
import { useWeekRange } from '../hooks/useWeekRange'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { TaskItem } from '@/src/features/schedule/day/components/TaskItem'
import { ActualTaskItem } from '@/src/features/schedule/day/components/ActualTaskItem'
import { WeekTimeTable } from '@/src/features/schedule/week/ui/WeekTimeTable'
import { useWeeklyActuals } from '@/src/features/schedule/week/hooks/useWeeklyActuals'
import { CreateTaskActualModal } from '@/src/features/schedule/day/components/CreateTaskActualModal'
import { formatLocalDate } from '@/src/lib/datetime'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { Task, TaskActualItem } from '@/src/features/schedule/day/types'

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

// ─── DaySection ───────────────────────────────────────────────────────────────
interface DaySectionProps {
  day: string
  dateStr: string
  tasks: Task[]
  actuals: TaskActualItem[]
  completedCount: number
}

function DaySection({ day, dateStr, tasks, actuals, completedCount }: DaySectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateActualOpen, setIsCreateActualOpen] = useState(false)

  return (
    <>
      <div className={`${isOpen ? 'bg-primary-50' : 'bg-gray-50'} border-y border-gray-100 last:border-none`}>
        {/* 헤더 */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={`${isOpen ? 'bg-primary-50' : 'bg-gray-50'} flex w-full items-center justify-between px-3 py-3`}
        >
          <div className="flex w-full gap-x-1">
            <div className="shrink-0">
              {isOpen ? (
                <ChevronUp size={16} className="text-[#8FA0A8]" />
              ) : (
                <ChevronDown size={16} className="text-[#8FA0A8]" />
              )}
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-x-1">
                <span className={`${isOpen ? 'text-primary-400' : 'text-gray-950'} body-md-medium`}>
                  {DAY_LABELS[day]}요일
                </span>
                <span className="text-xs text-gray-400">{dateStr.slice(5)}</span>
              </div>
              <span className="label-xs h-fit w-fit rounded-[4px] bg-gray-50 px-[6px] py-[1px] text-gray-300">
                {completedCount}/{tasks.length}
              </span>
            </div>
          </div>
        </button>

        {/* 태스크 목록 */}
        {isOpen && (
          <div className="flex flex-col gap-3 px-3 pb-3">
            {/* 계획 태스크 */}
            {tasks.length === 0 ? (
              <p className="text-muted-foreground px-1 text-xs">할 일이 없어요</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <TaskItem key={task.taskId} task={task} date={dateStr} />
                ))}
              </ul>
            )}

            {/* 실제 기록 */}
            {actuals.length > 0 && (
              <div className="flex flex-col gap-1">
                <p className="label-xs px-1 text-gray-400">완료 기록</p>
                <ul className="flex flex-col gap-2">
                  {actuals.map((actual) => (
                    <ActualTaskItem key={actual.taskActualId} actual={actual} date={dateStr} />
                  ))}
                </ul>
              </div>
            )}

            {/* 완료 기록 추가 버튼 */}
            <button
              type="button"
              onClick={() => setIsCreateActualOpen(true)}
              className="flex items-center gap-1 px-1 text-xs text-gray-400 hover:text-gray-600"
            >
              <Plus size={12} />
              완료 기록 추가
            </button>
          </div>
        )}
      </div>

      {isCreateActualOpen && (
        <CreateTaskActualModal
          isOpen={isCreateActualOpen}
          onClose={() => setIsCreateActualOpen(false)}
          date={dateStr}
        />
      )}
    </>
  )
}

// ─── WeekTaskList ─────────────────────────────────────────────────────────────
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
      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      <div className="flex gap-4">
        {/* 태스크 리스트 — 아코디언 */}
        {taskData && (
          <div className="w-64 shrink-0">
            {visibleDays.map((day) => {
              const tasks = taskData.tasksByDay[day] ?? []
              const actuals = actualData?.actualsByDay[day] ?? []
              const dayOffset = DAY_ORDER.indexOf(day)
              const dayDate = new Date(startDate)
              dayDate.setDate(dayDate.getDate() + dayOffset)
              const dateStr = formatLocalDate(dayDate)
              const completedCount = tasks.filter((t) => t.actual !== null).length

              return (
                <DaySection
                  key={day}
                  day={day}
                  dateStr={dateStr}
                  tasks={tasks}
                  actuals={actuals}
                  completedCount={completedCount}
                />
              )
            })}
          </div>
        )}

        {/* 주간 타임테이블 */}
        <div className="min-w-0 flex-1 overflow-x-auto">
          {isActualPending ? (
            <p className="text-muted-foreground text-sm">불러오는 중...</p>
          ) : actualData ? (
            <WeekTimeTable taskData={taskData ?? { tasksByDay: {} }} actualData={actualData} startDate={startDate} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
