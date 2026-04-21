import { Task } from '@/src/features/schedule/day/types'

interface Props {
  task: Task
}

export function TaskChip({ task }: Props) {
  const bg = task.goalCategoryColorCode ?? '#E5E7EB'

  return (
    <div
      className="truncate rounded-[3px] px-1.5 py-0.5 text-[10px] leading-[1.4]"
      style={{
        backgroundColor: bg + '33', // 투명도 20%
        color: bg,
      }}
      title={task.taskName}
    >
      {task.taskName}
    </div>
  )
}
