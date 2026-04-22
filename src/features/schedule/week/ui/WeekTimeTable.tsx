'use client'

import { Task } from '@/src/features/schedule/day/types'
import { WeeklyTasksResponse } from '../types'
import { groupTasksByHour, HOUR_LABELS, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'
import { formatLocalDate } from '@/src/lib/datetime'

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
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

const HOUR_HEIGHT = 20 // 일간(36px)의 축소 버전
const TEN_MIN_CELLS = Array.from({ length: 6 })

// ─────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────
function getDayDate(startDate: string, dayIndex: number): string {
  const d = new Date(startDate)
  d.setDate(d.getDate() + dayIndex)
  return formatLocalDate(d)
}

// ─────────────────────────────────────────────
// WeekTaskBlock - 일간 TaskBlock의 축소 버전
// leftPercent / widthPercent는 groupTasksByHour가 이미 계산
// ─────────────────────────────────────────────
interface WeekTaskBlockProps {
  positioned: PositionedTask<Task>
}

function WeekTaskBlock({ positioned }: WeekTaskBlockProps) {
  const { task, leftPercent, widthPercent, isDone } = positioned
  const color = task.generalCategoryColorCode ?? '#9CA3AF'

  return (
    <div
      title={task.taskName}
      style={{
        position: 'absolute',
        top: 1,
        bottom: 1,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: isDone ? `${color}33` : `${color}15`,
        border: `1.5px solid ${color}`,
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 2,
        boxSizing: 'border-box',
        opacity: isDone ? 1 : 0.5,
      }}
    >
      <span
        style={{
          fontSize: 8,
          fontWeight: 600,
          color,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1,
        }}
      >
        {task.taskName}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────
// WeekHourSlot - 일간 HourSlot의 축소 버전
// ─────────────────────────────────────────────
interface WeekHourSlotProps {
  hour: number
  tasks: PositionedTask<Task>[]
}

function WeekHourSlot({ hour, tasks }: WeekHourSlotProps) {
  return (
    <div style={{ display: 'flex', height: HOUR_HEIGHT }}>
      {/* 시간 레이블 */}
      <div
        style={{
          width: 16,
          flexShrink: 0,
          paddingTop: 1,
          textAlign: 'right',
          fontSize: 8,
          color: '#9CA3AF',
          userSelect: 'none',
          paddingRight: 2,
        }}
      >
        {hour}
      </div>

      {/* 10분 그리드 + 태스크 오버레이 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            height: '100%',
            border: '1px solid #D1D5DB',
            borderRadius: 1,
          }}
        >
          {TEN_MIN_CELLS.map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: i < 5 ? '1px solid #E5E7EB' : 'none',
              }}
            />
          ))}
        </div>

        {tasks.map((positioned, i) => (
          <WeekTaskBlock key={positioned.task.taskId ?? i} positioned={positioned} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DayColumn
// ─────────────────────────────────────────────
interface DayColumnProps {
  label: string
  date: string
  tasks: Task[]
}

function DayColumn({ label, date, tasks }: DayColumnProps) {
  const tasksByHour = groupTasksByHour(tasks, date)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div
        style={{
          borderBottom: '1px solid #E5E7EB',
          marginBottom: 4,
          paddingBottom: 4,
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: '#111827' }}>{label}</span>
        <span style={{ fontSize: 9, color: '#9CA3AF', marginLeft: 4 }}>{date.slice(5)}</span>
      </div>

      {/* 시간 슬롯 */}
      {HOUR_LABELS.map((hour) => (
        <WeekHourSlot key={hour} hour={hour} tasks={tasksByHour.get(hour) ?? []} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// WeekTimeTable
// ─────────────────────────────────────────────
interface WeekTimeTableProps {
  data: WeeklyTasksResponse
  startDate: string
}

const ROWS: (DayKey | null)[][] = [DAY_ORDER.slice(0, 4) as DayKey[], [...(DAY_ORDER.slice(4, 7) as DayKey[]), null]]

export function WeekTimeTable({ data, startDate }: WeekTimeTableProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {ROWS.map((rowDays, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 8,
          }}
        >
          {rowDays.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />

            const dayIndex = DAY_ORDER.indexOf(day)
            const dateStr = getDayDate(startDate, dayIndex)
            const tasks = data.tasksByDay[day] ?? []

            return <DayColumn key={day} label={DAY_LABELS[day]} date={dateStr} tasks={tasks} />
          })}
        </div>
      ))}
    </div>
  )
}
