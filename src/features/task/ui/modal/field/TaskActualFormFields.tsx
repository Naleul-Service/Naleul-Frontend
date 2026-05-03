import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { utcIsoToKstTimeLabel } from '@/src/lib/datetime'
import { Task } from '@/src/features/task/types'

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}분`
  if (m === 0) return `${h}시간`
  return `${h}시간 ${m}분`
}

interface TaskActualFormFieldsProps {
  task: Task
  actualStartAt: string
  onActualStartAtChange: (value: string) => void
  actualEndAt: string
  onActualEndAtChange: (value: string) => void
  error?: Error | null
}

export function TaskActualFormFields({
  task,
  actualStartAt,
  onActualStartAtChange,
  actualEndAt,
  onActualEndAtChange,
  error,
}: TaskActualFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-y-[6px] rounded-[10px] bg-gray-50 px-4 py-3">
        <p className="body-md-medium text-gray-300">계획</p>
        <div className="flex items-center gap-x-2">
          <p className="body-lg-medium">
            {utcIsoToKstTimeLabel(task.plannedStartAt)} ~ {utcIsoToKstTimeLabel(task.plannedEndAt)}
          </p>
          <span className="h4 text-primary-400">{formatMinutes(task.plannedDurationMinutes)}</span>
        </div>
      </div>

      <DateTimePicker label="실제 시작" value={actualStartAt} onChange={onActualStartAtChange} />
      <DateTimePicker label="실제 종료" value={actualEndAt} onChange={onActualEndAtChange} />

      {error && <p className="text-xs text-red-500">{error.message}</p>}
    </div>
  )
}
