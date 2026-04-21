import { PositionedTask } from '@/src/features/schedule/day/utils/timeTable'
import { Task } from '@/src/features/schedule/day/types'

interface TaskBlockProps {
  positioned: PositionedTask<Task>
}

const FALLBACK_COLOR = '#9CA3AF'

export function TaskBlock({ positioned }: TaskBlockProps) {
  const { task, leftPercent, widthPercent, isDone } = positioned

  const generalColor = task.generalCategoryColorCode ?? FALLBACK_COLOR
  const goalColor = task.goalCategoryColorCode ?? FALLBACK_COLOR

  return (
    <div
      title={task.taskName}
      style={{
        position: 'absolute',
        top: 2,
        bottom: 2,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: isDone ? `${generalColor}33` : 'transparent',
        border: `1.5px solid ${generalColor}`,
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        paddingLeft: 4,
        boxSizing: 'border-box',
      }}
    >
      {widthPercent > 15 && (
        <>
          {/* goalCategory 점 */}
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: goalColor,
              flexShrink: 0,
            }}
          />
          {/* taskName */}
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: generalColor,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {task.taskName}
          </span>
        </>
      )}
    </div>
  )
}
