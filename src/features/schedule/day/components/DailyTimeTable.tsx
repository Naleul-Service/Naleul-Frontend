import { useDailyTasks } from '@/src/features/schedule/day/hooks/useDailyTasks'
import { useDailyActuals } from '@/src/features/schedule/day/hooks/useDailyActuals'
import { DailyTasksParams, TaskActualItem } from '@/src/features/schedule/day/types'
import { HourSlot } from './HourSlot'
import { groupTasksByHour, HOUR_LABELS, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'
// utcIsoToKstMinutes import 추가 필요
import { utcIsoToKstMinutes } from '@/src/lib/datetime'

interface DailyTimeTableProps {
  params: DailyTasksParams
}

export function DailyTimeTable({ params }: DailyTimeTableProps) {
  const { data: tasks, isLoading: isLoadingTasks, isError: isErrorTasks } = useDailyTasks(params)
  const { data: actuals, isLoading: isLoadingActuals } = useDailyActuals({ date: params.date })

  const isLoading = isLoadingTasks || isLoadingActuals
  const isError = isErrorTasks

  if (isLoading) return <TimeTableSkeleton />
  if (isError || !tasks) return <TimeTableError />

  // planned: 기존 Task 기반
  const { planned } = groupTasksByHour(tasks, params.date)

  // actual: 독립 TaskActualItem 기반
  const actual = groupActualsByHour(actuals ?? [], params.date)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        gap: 2,
        maxHeight: 'calc(100svh - 120px)',
        paddingBottom: 16,
      }}
    >
      <div className="flex h-[24px] bg-gray-50 py-1">
        <div className="label-sm flex w-full items-center justify-center text-gray-500">계획</div>
        <div className="label-sm flex w-[44px] items-center justify-center text-gray-500">시간</div>
        <div className="label-sm flex w-full items-center justify-center text-gray-500">완료</div>
      </div>

      {HOUR_LABELS.map((hour) => (
        <HourSlot key={hour} hour={hour} plannedTasks={planned.get(hour) ?? []} actualTasks={actual.get(hour) ?? []} />
      ))}
    </div>
  )
}

// TaskActualItem은 Task와 구조가 달라서 별도 그룹핑 함수
function groupActualsByHour(actuals: TaskActualItem[], date: string): Map<number, PositionedTask<TaskActualItem>[]> {
  const map = new Map<number, PositionedTask<TaskActualItem>[]>()

  for (const actual of actuals) {
    const startMin = utcIsoToKstMinutes(actual.actualStartAt)
    let endMin = utcIsoToKstMinutes(actual.actualEndAt)
    if (endMin <= startMin) endMin += 24 * 60

    const clampedEnd = Math.min(endMin, 24 * 60)
    const startHour = Math.floor(startMin / 60)
    const endHour = clampedEnd % 60 === 0 ? clampedEnd / 60 - 1 : Math.floor(clampedEnd / 60)

    for (let hour = startHour; hour <= endHour; hour++) {
      const slotStart = hour * 60
      const slotEnd = slotStart + 60
      const segStart = Math.max(startMin, slotStart)
      const segEnd = Math.min(clampedEnd, slotEnd)
      const leftPercent = ((segStart - slotStart) / 60) * 100
      const widthPercent = Math.max(((segEnd - segStart) / 60) * 100, 4)

      if (!map.has(hour)) map.set(hour, [])
      map.get(hour)!.push({ task: actual, leftPercent, widthPercent, hour, isDone: true })
    }
  }

  return map
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
