import { calcAchievementRatio, PositionedTask } from '@/src/features/schedule/day/utils/timeTable'
import { Task } from '@/src/features/schedule/day/types'

interface TaskBlockProps {
  positioned: PositionedTask<Task>
  date: string
}

const FALLBACK_COLOR = '#9CA3AF'

export function TaskBlock({ positioned, date }: TaskBlockProps) {
  const { task, leftPercent, widthPercent, isDone } = positioned

  const generalColor = task.generalCategoryColorCode ?? FALLBACK_COLOR
  const goalColor = task.goalCategoryColorCode ?? FALLBACK_COLOR

  // 6칸 중 3칸 이상 겹치면 달성 = ratio >= 0.5
  const achievementRatio = calcAchievementRatio(task, date)
  const isAchieved = achievementRatio >= 0.5

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
              flex: 1,
            }}
          >
            {task.taskName}
          </span>

          {/* 달성 뱃지 */}
          {/* 달성 뱃지 — 별도 조건으로 분리 */}
          {isAchieved && widthPercent > 25 && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: '#fff',
                backgroundColor: generalColor,
                borderRadius: 2,
                padding: '1px 5px',
                flexShrink: 0,
                marginRight: 3,
                lineHeight: '14px', // 높이 고정
                whiteSpace: 'nowrap',
              }}
            >
              ✓
            </span>
          )}
        </>
      )}
    </div>
  )
}
