'use client'

import { useState } from 'react'
import { cn } from '@/src/lib/utils'
import { Task, TaskActualItem } from '@/src/features/task/types'
import { WeeklyActualsResponse, WeeklyTasksResponse } from '../../types'
import { MobileWeekTimeTable } from './MobileWeekTimeTable'
import { formatLocalDate } from '@/src/lib/datetime'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { TaskItem } from '@/src/features/schedule/day/components/TaskItem'
import { ActualTaskItem } from '@/src/features/schedule/day/components/ActualTaskItem'
import { CreateTaskActualModal } from '@/src/features/task/ui/modal/CreateTaskActualModal'

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

type MobileTab = 'schedule' | 'timeline'

const MOBILE_TABS: { key: MobileTab; label: string }[] = [
  { key: 'schedule', label: '일정' },
  { key: 'timeline', label: '타임라인' },
]

// ─── DaySection ───────────────────────────────────────────
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

        {isOpen && (
          <div className="flex flex-col gap-3 px-3 pb-3">
            {tasks.length === 0 ? (
              <p className="text-muted-foreground px-1 text-xs">할 일이 없어요</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {tasks.map((task) => (
                  <TaskItem key={task.taskId} task={task} date={dateStr} />
                ))}
              </ul>
            )}

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

// ─── MobileWeekLayout ─────────────────────────────────────
interface MobileWeekLayoutProps {
  taskData: WeeklyTasksResponse
  actualData: WeeklyActualsResponse
  startDate: string
  isPending: boolean
  isError: boolean
}

export function MobileWeekLayout({ taskData, actualData, startDate, isPending, isError }: MobileWeekLayoutProps) {
  const [mobileTab, setMobileTab] = useState<MobileTab>('schedule')

  return (
    <div className="flex flex-col gap-3">
      {/* 탭 */}
      <div className="flex border-b border-gray-100">
        {MOBILE_TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setMobileTab(key)}
            className={cn(
              'flex-1 pb-2 text-sm font-medium transition-colors',
              mobileTab === key ? 'border-b-2 border-gray-700 text-gray-700' : 'text-gray-400 hover:text-gray-500'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isPending && <p className="text-muted-foreground text-sm">불러오는 중...</p>}
      {isError && <p className="text-sm text-red-500">할 일을 불러오지 못했어요</p>}

      {!isPending && !isError && (
        <>
          {mobileTab === 'schedule' && (
            <div>
              {DAY_ORDER.map((day) => {
                const tasks = taskData.tasksByDay[day] ?? []
                const actuals = actualData.actualsByDay[day] ?? []
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

          {mobileTab === 'timeline' && (
            <MobileWeekTimeTable taskData={taskData} actualData={actualData} startDate={startDate} />
          )}
        </>
      )}
    </div>
  )
}
