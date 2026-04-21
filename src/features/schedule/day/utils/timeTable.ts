export const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => i)

export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

export function isoToMinutes(iso: string): number {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

export interface PositionedTask<T> {
  task: T
  leftPercent: number
  widthPercent: number
  hour: number
  isDone: boolean
}

interface TaskActualSummary {
  actualDate: string
  actualStartAt: string
  actualEndAt: string
}

interface TimeRange {
  plannedStartAt: string
  plannedEndAt: string
  actuals: TaskActualSummary[]
}

function getActualByDate(task: TimeRange, date: string): TaskActualSummary | null {
  return task.actuals.find((a) => a.actualDate === date) ?? null
}

function splitByHour<T extends TimeRange>(
  task: T,
  startIso: string,
  endIso: string,
  isDone: boolean,
  map: Map<number, PositionedTask<T>[]>
) {
  const startMin = isoToMinutes(startIso)
  const endMin = isoToMinutes(endIso)

  const startHour = Math.floor(startMin / 60)
  const endHour = endMin % 60 === 0 ? endMin / 60 - 1 : Math.floor(endMin / 60)

  for (let hour = startHour; hour <= endHour; hour++) {
    const slotStart = hour * 60
    const slotEnd = slotStart + 60

    const segStart = Math.max(startMin, slotStart)
    const segEnd = Math.min(endMin, slotEnd)

    const leftPercent = ((segStart - slotStart) / 60) * 100
    const widthPercent = Math.max(((segEnd - segStart) / 60) * 100, 4)

    if (!map.has(hour)) map.set(hour, [])
    map.get(hour)!.push({ task, leftPercent, widthPercent, hour, isDone })
  }
}

export function groupTasksByHour<T extends TimeRange>(
  tasks: T[],
  date: string // 추가
): Map<number, PositionedTask<T>[]> {
  const map = new Map<number, PositionedTask<T>[]>()

  for (const task of tasks) {
    const actual = getActualByDate(task, date)
    const isDone = actual !== null

    if (isDone) {
      splitByHour(task, actual.actualStartAt, actual.actualEndAt, true, map)
    } else {
      splitByHour(task, task.plannedStartAt, task.plannedEndAt, false, map)
    }
  }

  return map
}

function toMinutesOfDay(iso: string): number {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

export function calcAchievementRatio(task: TimeRange, date: string): number {
  const actual = getActualByDate(task, date)
  if (!actual) return 0

  const plannedStart = toMinutesOfDay(task.plannedStartAt)
  const plannedEnd = toMinutesOfDay(task.plannedEndAt)
  const actualStart = toMinutesOfDay(actual.actualStartAt)
  const actualEnd = toMinutesOfDay(actual.actualEndAt)

  const plannedDuration = plannedEnd - plannedStart
  if (plannedDuration <= 0) return 0

  const overlapStart = Math.max(plannedStart, actualStart)
  const overlapEnd = Math.min(plannedEnd, actualEnd)
  const overlap = Math.max(0, overlapEnd - overlapStart)

  return overlap / plannedDuration
}
