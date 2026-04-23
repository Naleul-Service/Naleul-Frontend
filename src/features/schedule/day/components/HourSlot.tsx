import { TaskBlock } from './TaskBlock'
import { formatHourLabel, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

// TaskBlock의 BlockItem과 동일한 제약
interface BlockItem {
  taskName: string
  generalCategoryColorCode: string | null
  goalCategoryColorCode: string | null
  actual?: unknown
  plannedStartAt?: string
  plannedEndAt?: string
}

interface HourSlotProps<P extends BlockItem, A extends BlockItem> {
  hour: number
  plannedTasks: PositionedTask<P>[]
  actualTasks: PositionedTask<A>[]
}

const TEN_MIN_CELLS = Array.from({ length: 6 })

function SlotGrid<T extends BlockItem>({ tasks }: { tasks: PositionedTask<T>[] }) {
  return (
    <div style={{ flex: 1, position: 'relative' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          height: '100%',
          border: '1px solid #E0E7EA',
          borderRadius: 8,
        }}
      >
        {TEN_MIN_CELLS.map((_, i) => (
          <div key={i} style={{ borderRight: i < 5 ? '1px solid #E5E7EB' : 'none' }} />
        ))}
      </div>
      {tasks.map((positioned, i) => (
        <TaskBlock key={i} positioned={positioned} />
      ))}
    </div>
  )
}

export function HourSlot<P extends BlockItem, A extends BlockItem>({
  hour,
  plannedTasks,
  actualTasks,
}: HourSlotProps<P, A>) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 34 }}>
      <SlotGrid tasks={plannedTasks} />

      <div
        style={{
          width: 44,
          flexShrink: 0,
          paddingTop: 8,
          textAlign: 'center',
          fontSize: 11,
          color: '#9CA3AF',
          userSelect: 'none',
        }}
      >
        {formatHourLabel(hour)}
      </div>

      <SlotGrid tasks={actualTasks} />
    </div>
  )
}
