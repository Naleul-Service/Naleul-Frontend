import { calcAchievementRatio, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

interface BlockItem {
  taskName: string
  generalCategoryColorCode: string | null
  goalCategoryColorCode: string | null
  actual?: unknown
  plannedStartAt?: string
  plannedEndAt?: string
}

interface TaskBlockProps<T extends BlockItem> {
  positioned: PositionedTask<T>
}

const FALLBACK_COLOR = '#9CA3AF'

export function TaskBlock<T extends BlockItem>({ positioned }: TaskBlockProps<T>) {
  const { task, leftPercent, widthPercent, isDone } = positioned

  const generalColor = task.generalCategoryColorCode ?? FALLBACK_COLOR
  const goalColor = task.goalCategoryColorCode ?? FALLBACK_COLOR

  // planned Task일 때만 달성률 계산 (actual, plannedStartAt 있을 때)
  const isAchieved =
    task.plannedStartAt && task.plannedEndAt
      ? calcAchievementRatio(task as Parameters<typeof calcAchievementRatio>[0]) >= 0.5
      : false

  return (
    <div
      title={task.taskName}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: isDone ? `${generalColor}33` : 'transparent',
        borderTop: `1px solid ${generalColor}`,
        borderBottom: `1px solid ${generalColor}`,
        borderRight: `1px solid ${generalColor}`,
        borderLeft: `4px solid ${goalColor}`,
        borderRadius: '4px 6px 6px 4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        paddingLeft: 4,
        boxSizing: 'border-box',
      }}
    >
      {widthPercent > 15 && (
        <div className="flex items-center gap-x-2">
          <span
            className="body-md-medium text-primary-800"
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1,
            }}
          >
            {task.taskName}
          </span>
        </div>
      )}
    </div>
  )
}
