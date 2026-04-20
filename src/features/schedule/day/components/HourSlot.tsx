import { Task } from '@/src/features/schedule/day/types'
import { TaskBlock } from './TaskBlock'
import { formatHourLabel, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

interface HourSlotProps {
  hour: number
  tasks: PositionedTask<Task>[]
}

const TEN_MIN_CELLS = Array.from({ length: 6 })

/**
 * 1시간 단위 슬롯
 * - 10분 단위 6칸 가로 grid
 * - 안쪽 border 연하게(#E5E7EB), 바깥 border 진하게(#D1D5DB)
 * - tasks를 절대 위치로 가로 오버레이
 * 책임: 1시간짜리 시각 구조 + 태스크 오버레이
 */
export function HourSlot({ hour, tasks }: HourSlotProps) {
  return (
    <div style={{ display: 'flex', minHeight: 36 }}>
      {/* 시간 레이블 */}
      <div
        style={{
          width: 44,
          flexShrink: 0,
          paddingTop: 2,
          paddingRight: 8,
          textAlign: 'right',
          fontSize: 11,
          color: '#9CA3AF',
          userSelect: 'none',
        }}
      >
        {formatHourLabel(hour)}
      </div>

      {/* 10분 그리드 + 태스크 오버레이 */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* 10분 칸 6개 — 가로 배치 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            height: '100%',
            border: '1px solid #D1D5DB', // 바깥 진하게
            borderRadius: 2,
          }}
        >
          {TEN_MIN_CELLS.map((_, i) => (
            <div
              key={i}
              style={{
                borderRight: i < 5 ? '1px solid #E5E7EB' : 'none', // 안쪽 연하게
              }}
            />
          ))}
        </div>

        {/* 태스크 절대 오버레이 */}
        {tasks.map((positioned, i) => (
          <TaskBlock key={positioned.task.taskId ?? i} positioned={positioned} />
        ))}
      </div>
    </div>
  )
}
