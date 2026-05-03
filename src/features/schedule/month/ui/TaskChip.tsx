import { Task } from '@/src/features/task/types'

interface Props {
  task: Task
  mobile?: boolean
}

export function TaskChip({ task, mobile = false }: Props) {
  const generalColor = task.generalCategoryColorCode ?? '#E5E7EB'
  const goalColor = task.goalCategoryColorCode ?? '#E5E7EB'

  if (mobile) {
    return (
      <div
        style={{
          fontSize: 8,
          fontWeight: 500,
          lineHeight: '130%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: '#1F2937',
          backgroundColor: `${generalColor}33`,
          // borderTop: `1px solid ${generalColor}`,
          // borderBottom: `1px solid ${generalColor}`,
          // borderRight: `1px solid ${generalColor}`,
          borderLeft: `2px solid ${goalColor}`,
        }}
        title={task.taskName}
      >
        {task.taskName}
      </div>
    )
  }

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
