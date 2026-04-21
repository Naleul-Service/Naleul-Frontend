import { Task } from '../types'

const PRIORITY_STYLE: Record<string, string> = {
  A: 'bg-red-500',
  B: 'bg-amber-400',
  C: 'bg-blue-500',
}

export function TaskItem({ task }: { task: Task }) {
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })

  return (
    <li className="border-border flex items-center gap-3 rounded-lg border px-4 py-3">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${PRIORITY_STYLE[task.taskPriority] ?? 'bg-foreground'}`}
      >
        {task.taskPriority}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-sm font-medium">{task.taskName}</p>
        {task.goalCategoryName && (
          <p className="text-muted-foreground mt-0.5 truncate text-xs">{task.goalCategoryName}</p>
        )}
      </div>

      <span className="text-muted-foreground shrink-0 text-xs">
        {fmt(task.plannedStartAt)} ~ {fmt(task.plannedEndAt)}
      </span>
    </li>
  )
}
