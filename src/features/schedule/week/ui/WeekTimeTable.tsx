'use client'

import { useRouter } from 'next/navigation'
import { Task, TaskActualItem } from '@/src/features/schedule/day/types'
import { WeeklyActualsResponse, WeeklyTasksResponse } from '../types'
import { HOUR_LABELS, PositionedTask, utcIsoToKstDateStr } from '@/src/features/schedule/day/utils/timeTable'
import { formatLocalDate, utcIsoToKstMinutes } from '@/src/lib/datetime'
import { groupActualsByHour, groupPlannedByHour } from '@/src/features/schedule/week/utils/timeTable' // ─── 상수 ───────────────────────────────────────────────────────────────────

// ─── 상수 ───────────────────────────────────────────────────────────────────
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

const HOUR_HEIGHT = 28
const TEN_MIN_CELLS = Array.from({ length: 6 })
const ROWS: (DayKey | null)[][] = [DAY_ORDER.slice(0, 4) as DayKey[], [...(DAY_ORDER.slice(4, 7) as DayKey[]), null]]

// ─── 유틸 ───────────────────────────────────────────────────────────────────
function getDayDate(startDate: string, dayIndex: number): string {
  const d = new Date(startDate + 'T00:00:00')
  d.setDate(d.getDate() + dayIndex)
  return formatLocalDate(d)
}

/** 각 요일 DayColumn에 넘길 actuals를 계산
 *  - 자신의 날짜에 속한 태스크
 *  - 전날 태스크 중 KST endDate가 자신의 날짜인 오버나이트 태스크 포함
 */
function resolveActualsForDay(
  actualData: WeeklyActualsResponse,
  dayIndex: number,
  startDate: string
): TaskActualItem[] {
  const currentDay = DAY_ORDER[dayIndex]
  const ownActuals = actualData.actualsByDay[currentDay] ?? []
  if (dayIndex === 0) return ownActuals

  const currentDateStr = getDayDate(startDate, dayIndex)

  // 전날 하나만이 아니라 앞선 모든 날 체크
  const overflowFromPrev = DAY_ORDER.slice(0, dayIndex).flatMap((prevDay) => {
    const prevActuals = actualData.actualsByDay[prevDay] ?? []
    return prevActuals.filter((actual) => {
      const endDateStr = utcIsoToKstDateStr(actual.actualEndAt)
      return endDateStr === currentDateStr
    })
  })

  return [...ownActuals, ...overflowFromPrev]
}

function resolvePlannedForDay(taskData: WeeklyTasksResponse, dayIndex: number, startDate: string): Task[] {
  const currentDay = DAY_ORDER[dayIndex]
  const ownTasks = taskData.tasksByDay[currentDay] ?? []
  if (dayIndex === 0) return ownTasks

  const currentDateStr = getDayDate(startDate, dayIndex)
  const ownTaskIds = new Set(ownTasks.map((t) => t.taskId)) // 추가

  const overflowFromPrev = DAY_ORDER.slice(0, dayIndex).flatMap((prevDay) => {
    const prevTasks = taskData.tasksByDay[prevDay] ?? []
    return prevTasks.filter((task) => {
      if (task.actual !== null) return false
      if (ownTaskIds.has(task.taskId)) return false // 이미 있으면 skip
      const endDateStr = utcIsoToKstDateStr(task.plannedEndAt)
      if (endDateStr !== currentDateStr) return false
      const kstEndMinutes = utcIsoToKstMinutes(task.plannedEndAt)
      if (kstEndMinutes === 0) return false
      return true
    })
  })

  return [...ownTasks, ...overflowFromPrev]
}

// ─── WeekTaskBlock ───────────────────────────────────────────────────────────
// Task, TaskActualItem 둘 다 generalCategoryColorCode / taskName을 가지므로
// 필요한 필드만 추출하는 타입으로 처리
interface BlockItem {
  taskName: string
  generalCategoryColorCode: string | null
  goalCategoryColorCode: string | null
}

interface WeekTaskBlockProps {
  positioned: PositionedTask<BlockItem>
  isActual: boolean
}

function WeekTaskBlock({ positioned, isActual }: WeekTaskBlockProps) {
  const { task, leftPercent, widthPercent } = positioned
  const generalColor = task.generalCategoryColorCode ?? '#9CA3AF'
  const goalColor = task.goalCategoryColorCode ?? '#9CA3AF'

  return (
    <div
      title={task.taskName}
      style={{
        position: 'absolute',
        top: 1,
        bottom: 1,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: isActual ? `${generalColor}33` : 'transparent',
        borderLeft: `3px solid ${goalColor}`,
        borderRight: `1px solid ${generalColor}`,
        borderTop: `1px solid ${generalColor}`,
        borderBottom: `1px solid ${generalColor}`,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 2,
        boxSizing: 'border-box',
      }}
    >
      <span className="label-xs truncate text-gray-800">{task.taskName}</span>
    </div>
  )
}

// ─── WeekHourSlot ────────────────────────────────────────────────────────────
// WeekHourSlot — plannedTasks prop 제거, renderTimeBlock 하나만
interface WeekHourSlotProps {
  actualTasks: PositionedTask<TaskActualItem>[]
  plannedTasks: PositionedTask<Task>[]
}

// WeekHourSlot — 위(planned) / 아래(actual) 분리
function WeekHourSlot({ actualTasks, plannedTasks }: WeekHourSlotProps) {
  const tasksToRender = actualTasks.length > 0 ? actualTasks : plannedTasks
  const isActual = actualTasks.length > 0

  return (
    <div style={{ display: 'flex', height: HOUR_HEIGHT, alignItems: 'stretch' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            height: '100%',
            border: '1px solid #E0E7EA',
            borderRadius: 4,
          }}
        >
          {TEN_MIN_CELLS.map((_, i) => (
            <div key={i} style={{ borderRight: i < 5 ? '1px solid #E0E7EA' : 'none' }} />
          ))}
        </div>
        {tasksToRender.map((p, i) => (
          <WeekTaskBlock
            key={isActual ? `${p.task.taskName}-actual-${p.hour}-${i}` : `${p.task.taskId}-planned-${p.hour}`}
            positioned={p as PositionedTask<BlockItem>}
            isActual={isActual}
          />
        ))}
      </div>
    </div>
  )
}

// ─── DayColumn ───────────────────────────────────────────────────────────────
interface DayColumnProps {
  label: string
  date: string
  actuals: TaskActualItem[]
  plannedTasks: Task[]
}

// DayColumn — planned 제거, 헤더 단순화
function DayColumn({ label, date, actuals, plannedTasks }: DayColumnProps) {
  const actual = groupActualsByHour(actuals, date)
  const plannedByHour = groupPlannedByHour(plannedTasks, date)
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/schedule?date=${date}`)}
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
      {/* 헤더 */}
      <div className="mb-[6px] flex h-[28px] items-center justify-center rounded-[4px] bg-gray-50">
        <span className="label-sm text-gray-500">{label}</span>
        <span style={{ fontSize: 9, color: '#9CA3AF', marginLeft: 4 }}>{date.slice(5)}</span>
      </div>
      {HOUR_LABELS.map((hour) => (
        <div key={hour} style={{ marginBottom: 2 }}>
          <WeekHourSlot plannedTasks={plannedByHour.get(hour) ?? []} actualTasks={actual.get(hour) ?? []} />
        </div>
      ))}
    </div>
  )
}

// ─── WeekTimeTable ───────────────────────────────────────────────────────────
interface WeekTimeTableProps {
  taskData: WeeklyTasksResponse
  actualData: WeeklyActualsResponse
  startDate: string
}

// WeekTimeTable — 시간 레이블 컬럼 추가
export function WeekTimeTable({ taskData, actualData, startDate }: WeekTimeTableProps) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {/* 시간 레이블 컬럼 */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* 헤더 높이만큼 공백 */}
        <div style={{ height: 36 }} />
        {HOUR_LABELS.map((hour) => (
          <div
            className="label-sm text-gray-300"
            key={hour}
            style={{
              height: HOUR_HEIGHT,
              marginBottom: 2,
              width: 16,
              textAlign: 'center',
              userSelect: 'none',
              paddingTop: 1,
              flexShrink: 0,
            }}
          >
            {hour}
          </div>
        ))}
      </div>

      {/* 요일 컬럼들 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, flex: 1 }}>
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
