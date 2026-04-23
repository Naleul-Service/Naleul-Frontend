import { calcAchievementRatio, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

interface BlockItem {
  taskName: string
  generalCategoryColorCode: string | null
  goalCategoryColorCode: string | null
  // Task는 actual 있음, TaskActualItem은 없음
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
        top: 2,
        bottom: 2,
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        borderRadius: 6,
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
        <div className="flex items-center gap-x-2">
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: goalColor,
              flexShrink: 0,
            }}
          />
          <span
            className="body-md-medium"
            style={{
              color: generalColor,
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
