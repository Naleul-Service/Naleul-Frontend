'use client'

import { useRouter } from 'next/navigation'
import { TaskActualItem } from '@/src/features/schedule/day/types'
import { WeeklyActualsResponse } from '../types'
import { HOUR_LABELS, PositionedTask, utcIsoToKstDateStr } from '@/src/features/schedule/day/utils/timeTable'
import { formatLocalDate } from '@/src/lib/datetime'
import { groupActualsByHour } from '@/src/features/schedule/week/utils/timeTable' // ─── 상수 ───────────────────────────────────────────────────────────────────

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

const HOUR_HEIGHT = 24
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
  dayIndex: number, // 0 = MONDAY ... 6 = SUNDAY
  startDate: string
): TaskActualItem[] {
  const currentDay = DAY_ORDER[dayIndex]
  const ownActuals = actualData.actualsByDay[currentDay] ?? []

  // 전날이 없으면 자신 것만
  if (dayIndex === 0) return ownActuals

  const prevDay = DAY_ORDER[dayIndex - 1]
  const prevActuals = actualData.actualsByDay[prevDay] ?? []
  const currentDateStr = getDayDate(startDate, dayIndex)

  // 전날 데이터 중 KST endDate가 오늘인 오버나이트 태스크
  const overflowFromPrev = prevActuals.filter((actual) => {
    const endDateStr = utcIsoToKstDateStr(actual.actualEndAt)
    return endDateStr === currentDateStr
  })

  return [...ownActuals, ...overflowFromPrev]
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
        backgroundColor: isActual ? `${generalColor}33` : `${generalColor}15`,
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
}

function WeekHourSlot({ actualTasks }: WeekHourSlotProps) {
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
        {actualTasks.map((p, i) => (
          <WeekTaskBlock key={p.task.taskName + i} positioned={p as PositionedTask<BlockItem>} isActual={true} />
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
}

// DayColumn — planned 제거, 헤더 단순화
function DayColumn({ label, date, actuals }: DayColumnProps) {
  const actual = groupActualsByHour(actuals, date)
  const router = useRouter()
  console.log(utcIsoToKstDateStr('2026-04-24T00:00:00'))
  // 뭐가 나와?

  console.log(utcIsoToKstDateStr('2026-04-23T15:00:00'))
  // 이건?

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
          <WeekHourSlot actualTasks={actual.get(hour) ?? []} />
        </div>
      ))}
    </div>
  )
}

// ─── WeekTimeTable ───────────────────────────────────────────────────────────
interface WeekTimeTableProps {
  actualData: WeeklyActualsResponse
  startDate: string
}

// WeekTimeTable — 시간 레이블 컬럼 추가
export function WeekTimeTable({ actualData, startDate }: WeekTimeTableProps) {
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
          // ✅ 여기만 변경
          const actuals = resolveActualsForDay(actualData, i, startDate)

          return <DayColumn key={day} label={DAY_LABELS[day]} date={dateStr} actuals={actuals} />
        })}
      </div>
    </div>
  )
}
