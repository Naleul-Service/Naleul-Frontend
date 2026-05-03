import { Task } from '@/src/features/task/types'

interface Props {
  task: Task
}

export function TaskChip({ task }: Props) {
  const generalColor = task.generalCategoryColorCode ?? '#E5E7EB'
  const goalColor = task.goalCategoryColorCode ?? '#E5E7EB'

  return (
    <div
      className="label-xs truncate rounded-[4px] px-[6px] py-[3px] text-gray-800"
      style={{
        backgroundColor: `${generalColor}33`,
        borderTop: `1px solid ${generalColor}`,
        borderBottom: `1px solid ${generalColor}`,
        borderRight: `1px solid ${generalColor}`,
        borderLeft: `3px solid ${goalColor}`,
      }}
      title={task.taskName}
    >
      {task.taskName}
    </div>
  )
}
