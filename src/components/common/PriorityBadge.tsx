import { TaskPriority } from '@/src/features/task/types'

interface PriorityBadgeProps {
  label: TaskPriority
}

const PRIORITY_STYLE: Record<TaskPriority, string> = {
  A: 'bg-[#FF6B6B]',
  B: 'bg-[#FB923C]',
  C: 'bg-[#FFE46A]',
  D: 'bg-[#34C759]',
  E: 'bg-[#3BBBF6]',
}

export default function PriorityBadge({ label }: PriorityBadgeProps) {
  return (
    <span
      className={`label-lg flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white ${PRIORITY_STYLE[label] ?? 'bg-foreground'}`}
    >
      {label}
    </span>
  )
}
