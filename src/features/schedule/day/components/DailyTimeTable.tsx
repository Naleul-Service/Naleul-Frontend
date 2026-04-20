import { useDailyTasks } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { DailyTasksParams } from '@/src/features/schedule/day/types'
import { HourSlot } from './HourSlot'
import { groupTasksByHour, HOUR_LABELS } from '@/src/features/schedule/day/utils/timeTable'

interface DailyTimeTableProps {
  params: DailyTasksParams
}

/**
 * 일간 시간표 진입점
 * 책임: 데이터 패칭 → 시간대별 그룹핑 → HourSlot 목록 렌더
 * UI 세부사항은 HourSlot / TaskBlock에 위임
 */
export function DailyTimeTable({ params }: DailyTimeTableProps) {
  const { data, isLoading, isError } = useDailyTasks(params)

  if (isLoading) return <TimeTableSkeleton />
  if (isError || !data) return <TimeTableError />

  const tasksByHour = groupTasksByHour(data.tasks)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflowY: 'auto',
        maxHeight: 'calc(100svh - 120px)',
        paddingBottom: 16,
      }}
    >
      {HOUR_LABELS.map((hour) => (
        <HourSlot key={hour} hour={hour} tasks={tasksByHour.get(hour) ?? []} />
      ))}
    </div>
  )
}

function TimeTableSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {HOUR_LABELS.map((h) => (
        <div
          key={h}
          style={{
            height: 60,
            margin: '0 0 0 44px',
            borderRadius: 2,
            background: '#F3F4F6',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  )
}

function TimeTableError() {
  return (
    <div style={{ padding: '40px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
      일정을 불러오지 못했어요
    </div>
  )
}
