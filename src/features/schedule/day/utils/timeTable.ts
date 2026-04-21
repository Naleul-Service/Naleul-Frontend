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

interface TimeRange {
  plannedStartAt: string
  plannedEndAt: string
  actualStartAt: string | null
  actualEndAt: string | null
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

export function groupTasksByHour<T extends TimeRange>(tasks: T[]): Map<number, PositionedTask<T>[]> {
  const map = new Map<number, PositionedTask<T>[]>()

  for (const task of tasks) {
    const isDone = task.actualStartAt !== null && task.actualEndAt !== null

    if (isDone) {
      // 실제 시간으로 표시 (배경색 O)
      splitByHour(task, task.actualStartAt!, task.actualEndAt!, true, map)
    } else {
      // 계획 시간으로 표시 (border only)
      splitByHour(task, task.plannedStartAt, task.plannedEndAt, false, map)
    }
  }

  return map
}
