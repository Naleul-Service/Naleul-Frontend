'use client'

import { useRouter } from 'next/navigation'
import { Task, TaskActualItem } from '@/src/features/task/types'
import { WeeklyActualsResponse, WeeklyTasksResponse } from '../../types'
import { utcIsoToKstDateStr } from '@/src/features/schedule/day/utils/timeTable'
import { formatLocalDate, utcIsoToKstMinutes } from '@/src/lib/datetime'
import { isOvernightIntoDate } from '@/src/features/schedule/week/utils/timeTable'

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const
type DayKey = (typeof DAY_ORDER)[number]

const DAY_LABELS: Record<DayKey, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
}

// ─── 상수 ─────────────────────────────────────────────────────────────────
const TOTAL_MINUTES = 24 * 60
const HOUR_HEIGHT = 30 // 1시간 = 60px
const TOTAL_HEIGHT = HOUR_HEIGHT * 24
const TIME_LABEL_WIDTH = 24
const HOURS = Array.from({ length: 25 }, (_, i) => i) // 0~24

// ─── 유틸 ─────────────────────────────────────────────────────────────────
function getDayDate(startDate: string, dayIndex: number): string {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + dayIndex)
  return formatLocalDate(d)
}

function minutesToTop(minutes: number): number {
  return (minutes / TOTAL_MINUTES) * TOTAL_HEIGHT
}

function durationToHeight(startMin: number, endMin: number): number {
  const duration = endMin <= startMin ? TOTAL_MINUTES - startMin + endMin : endMin - startMin
  return (duration / TOTAL_MINUTES) * TOTAL_HEIGHT
}

function resolveActualsForDay(
  actualData: WeeklyActualsResponse,
  dayIndex: number,
  startDate: string
): TaskActualItem[] {
  const currentDay = DAY_ORDER[dayIndex]
  const ownActuals = actualData.actualsByDay[currentDay] ?? []
  if (dayIndex === 0) return ownActuals

  const currentDateStr = getDayDate(startDate, dayIndex)
  const overflowFromPrev = DAY_ORDER.slice(0, dayIndex).flatMap((prevDay) => {
    return (actualData.actualsByDay[prevDay] ?? []).filter((actual) =>
      isOvernightIntoDate(actual.actualEndAt, currentDateStr)
    )
  })

  return [...ownActuals, ...overflowFromPrev]
}

function resolvePlannedForDay(taskData: WeeklyTasksResponse, dayIndex: number, startDate: string): Task[] {
  const currentDay = DAY_ORDER[dayIndex]
  const ownTasks = taskData.tasksByDay[currentDay] ?? []
  if (dayIndex === 0) return ownTasks

  const currentDateStr = getDayDate(startDate, dayIndex)
  const ownTaskIds = new Set(ownTasks.map((t) => t.taskId))
  const overflowFromPrev = DAY_ORDER.slice(0, dayIndex).flatMap((prevDay) => {
    return (taskData.tasksByDay[prevDay] ?? []).filter((task) => {
      if (task.actual !== null) return false
      if (ownTaskIds.has(task.taskId)) return false
      if (utcIsoToKstDateStr(task.plannedEndAt) !== currentDateStr) return false
      if (utcIsoToKstMinutes(task.plannedEndAt) === 0) return false
      return true
    })
  })

  return [...ownTasks, ...overflowFromPrev]
}

function clampToDay(startMin: number, endMin: number, isOvernight: boolean): { start: number; end: number } {
  // 오버나이트로 넘어온 태스크 — 이 날의 00:00부터 시작
  if (isOvernight && endMin < startMin) {
    return { start: 0, end: endMin }
  }
  // 이 날에서 다음날로 넘어가는 태스크 — 23:59까지만
  if (endMin < startMin) {
    return { start: startMin, end: TOTAL_MINUTES }
  }
  return { start: startMin, end: endMin }
}

// ─── TaskBlock ─────────────────────────────────────────────────────────────
interface TaskBlockProps {
  taskName: string
  startMinutes: number
  endMinutes: number
  goalColor: string
  generalColor: string
  isActual: boolean
}

function TaskBlock({ taskName, startMinutes, endMinutes, goalColor, generalColor, isActual }: TaskBlockProps) {
  const top = minutesToTop(startMinutes)
  const height = Math.max(durationToHeight(startMinutes, endMinutes), 12)

  return (
    <div
      title={taskName}
      style={{
        position: 'absolute',
        top,
        height,
        left: 0,
        right: 0,
        backgroundColor: isActual ? `${generalColor}33` : 'transparent',
        borderLeft: `3px solid ${goalColor}`,
        borderRight: `1px solid ${generalColor}`,
        borderTop: `1px solid ${generalColor}`,
        borderBottom: `1px solid ${generalColor}`,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: 2,
        paddingTop: 1,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{ fontSize: 9, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {taskName}
      </span>
    </div>
  )
}

// ─── DayColumn ─────────────────────────────────────────────────────────────
interface DayColumnProps {
  label: string
  date: string
  actuals: TaskActualItem[]
  plannedTasks: Task[]
}

function DayColumn({ label, date, actuals, plannedTasks }: DayColumnProps) {
  const router = useRouter()
  const hasActuals = actuals.length > 0
  const items = hasActuals ? actuals : plannedTasks

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* 헤더 */}
      <div
        onClick={() => router.push(`/schedule?date=${date}`)}
        style={{
          height: 36,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backgroundColor: '#F9FAFB',
          borderRadius: 4,
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 10, color: '#6B7280' }}>{label}</span>
        <span style={{ fontSize: 8, color: '#9CA3AF' }}>{date.slice(5)}</span>
      </div>

      {/* 타임라인 */}
      <div style={{ position: 'relative', height: TOTAL_HEIGHT, borderLeft: '1px solid #E0E7EA' }}>
        {/* 시간선 */}
        {/* 시간선 */}
        {HOURS.map((h) => (
          <div key={h}>
            {/* 정시 선 */}
            <div
              style={{
                position: 'absolute',
                top: h * HOUR_HEIGHT,
                left: 0,
                right: 0,
                borderTop: '1px solid #F3F4F6',
              }}
            />
            {/* 30분 점선 */}
            {h < 24 && (
              <div
                style={{
                  position: 'absolute',
                  top: h * HOUR_HEIGHT + HOUR_HEIGHT / 2,
                  left: 0,
                  right: 0,
                  borderTop: '1px dotted #F3F4F6',
                }}
              />
            )}
          </div>
        ))}

        {/* 태스크 블록 */}
        {hasActuals
          ? actuals.map((actual, i) => {
              const startMin = utcIsoToKstMinutes(actual.actualStartAt)
              const endMin = utcIsoToKstMinutes(actual.actualEndAt)
              const startDateStr = utcIsoToKstDateStr(actual.actualStartAt)
              const isOvernight = startDateStr !== date // 전날에서 넘어온 오버나이트

              const { start, end } = clampToDay(startMin, endMin, isOvernight)

              return (
                <TaskBlock
                  key={`actual-${actual.taskActualId}-${i}`}
                  taskName={actual.taskName}
                  startMinutes={start}
                  endMinutes={end}
                  goalColor={actual.goalCategoryColorCode ?? '#9CA3AF'}
                  generalColor={actual.generalCategoryColorCode ?? '#9CA3AF'}
                  isActual
                />
              )
            })
          : plannedTasks.map((task, i) => {
              const startMin = utcIsoToKstMinutes(task.plannedStartAt)
              const endMin = utcIsoToKstMinutes(task.plannedEndAt)
              const startDateStr = utcIsoToKstDateStr(task.plannedStartAt)
              const isOvernight = startDateStr !== date

              const { start, end } = clampToDay(startMin, endMin, isOvernight)

              return (
                <TaskBlock
                  key={`planned-${task.taskId}-${i}`}
                  taskName={task.taskName}
                  startMinutes={start}
                  endMinutes={end}
                  goalColor={task.goalCategoryColorCode ?? '#9CA3AF'}
                  generalColor={task.generalCategoryColorCode ?? '#9CA3AF'}
                  isActual={false}
                />
              )
            })}
      </div>
    </div>
  )
}

// ─── MobileWeekTimeTable ───────────────────────────────────────────────────
interface MobileWeekTimeTableProps {
  taskData: WeeklyTasksResponse
  actualData: WeeklyActualsResponse
  startDate: string
}

export function MobileWeekTimeTable({ taskData, actualData, startDate }: MobileWeekTimeTableProps) {
  return (
    <div style={{ display: 'flex', overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100svh - 200px)' }}>
      {/* 시간 레이블 */}
      <div style={{ flexShrink: 0, width: TIME_LABEL_WIDTH }}>
        <div style={{ height: 40 }} />
        <div style={{ position: 'relative', height: TOTAL_HEIGHT }}>
          {HOURS.slice(0, 24).map((h) => (
            <div
              key={h}
              style={{
                position: 'absolute',
                top: h * HOUR_HEIGHT - 6,
                right: 4,
                fontSize: 9,
                color: '#D1D5DB',
                userSelect: 'none',
              }}
            >
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* 요일 컬럼 */}
      <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
        {DAY_ORDER.map((day, i) => {
          const dateStr = getDayDate(startDate, i)
          const actuals = resolveActualsForDay(actualData, i, startDate)
          const plannedTasks = resolvePlannedForDay(taskData, i, startDate)

          return (
            <DayColumn key={day} label={DAY_LABELS[day]} date={dateStr} actuals={actuals} plannedTasks={plannedTasks} />
          )
        })}
      </div>
    </div>
  )
}
