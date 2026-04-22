import { utcIsoToKstMinutes } from '@/src/lib/datetime'

export const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => i)

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

export interface PositionedTask<T> {
  task: T
  leftPercent: number
  widthPercent: number
  hour: number
  isDone: boolean
}

interface TaskActualSummary {
  actualStartAt: string
  actualEndAt: string
}

interface TimeRange {
  plannedStartAt: string
  plannedEndAt: string
  actual: TaskActualSummary | null // actuals 배열 → actual 단수
}

function splitByHour<T extends TimeRange>(
  task: T,
  startIso: string,
  endIso: string,
  isDone: boolean,
  map: Map<number, PositionedTask<T>[]>,
  viewDate: string
) {
  const startMin = utcIsoToKstMinutes(startIso)
  let endMin = utcIsoToKstMinutes(endIso)

  const taskStartDate = new Date(startIso + 'Z')
  const kstStartDate = new Date(taskStartDate.getTime() + 9 * 60 * 60 * 1000)
  const kstStartDateStr = [
    kstStartDate.getUTCFullYear(),
    String(kstStartDate.getUTCMonth() + 1).padStart(2, '0'),
    String(kstStartDate.getUTCDate()).padStart(2, '0'),
  ].join('-')

  const isOvernight = kstStartDateStr !== viewDate
  const adjustedStartMin = isOvernight ? 0 : startMin

  if (endMin <= adjustedStartMin) endMin += 24 * 60

  const clampedEnd = Math.min(endMin, 24 * 60)
  const startHour = Math.floor(adjustedStartMin / 60)
  const endHour = clampedEnd % 60 === 0 ? clampedEnd / 60 - 1 : Math.floor(clampedEnd / 60)

  for (let hour = startHour; hour <= endHour; hour++) {
    const slotStart = hour * 60
    const slotEnd = slotStart + 60

    const segStart = Math.max(adjustedStartMin, slotStart)
    const segEnd = Math.min(clampedEnd, slotEnd)

    const leftPercent = ((segStart - slotStart) / 60) * 100
    const widthPercent = Math.max(((segEnd - segStart) / 60) * 100, 4)

    if (!map.has(hour)) map.set(hour, [])
    map.get(hour)!.push({ task, leftPercent, widthPercent, hour, isDone })
  }
}

export function groupTasksByHour<T extends TimeRange>(tasks: T[], date: string): Map<number, PositionedTask<T>[]> {
  const map = new Map<number, PositionedTask<T>[]>()

  for (const task of tasks) {
    const isDone = task.actual !== null

    if (isDone && task.actual) {
      splitByHour(task, task.actual.actualStartAt, task.actual.actualEndAt, true, map, date)
    } else {
      splitByHour(task, task.plannedStartAt, task.plannedEndAt, false, map, date)
    }
  }

  return map
}

export function calcAchievementRatio(task: TimeRange): number {
  if (!task.actual) return 0

  const plannedStart = utcIsoToKstMinutes(task.plannedStartAt)
  const plannedEnd = utcIsoToKstMinutes(task.plannedEndAt)
  const actualStart = utcIsoToKstMinutes(task.actual.actualStartAt)
  const actualEnd = utcIsoToKstMinutes(task.actual.actualEndAt)

  const plannedDuration = plannedEnd - plannedStart
  if (plannedDuration <= 0) return 0

  const overlapStart = Math.max(plannedStart, actualStart)
  const overlapEnd = Math.min(plannedEnd, actualEnd)
  const overlap = Math.max(0, overlapEnd - overlapStart)

  return overlap / plannedDuration
}
