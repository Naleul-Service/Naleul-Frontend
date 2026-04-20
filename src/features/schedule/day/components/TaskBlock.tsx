import { Task } from '@/src/features/schedule/day/types'
import { getCategoryColor, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

interface TaskBlockProps {
  positioned: PositionedTask<Task>
}

/**
 * 단일 태스크 블록
 * - generalCategoryId 기반 배경색
 * - goalCategoryId 기반 앞 동그라미
 * 책임: 태스크 1개의 시각 표현
 */
export function TaskBlock({ positioned }: TaskBlockProps) {
  const { task, leftPercent, widthPercent } = positioned
  const color = getCategoryColor(task.generalCategoryId)
  const goalColor = getCategoryColor(task.goalCategoryId)

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: 2,
        bottom: 2,
        backgroundColor: color.bg,
        borderRadius: 4,
        padding: '0 6px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        zIndex: 1,
      }}
    >
      {/* goalCategory 표시 동그라미 */}
      <span
        style={{
          flexShrink: 0,
          width: 7,
          height: 7,
          borderRadius: '50%',
          backgroundColor: goalColor.dot,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: color.text,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {task.taskName}
      </span>
    </div>
  )
}
