import { utcIsoToKstMinutes } from '@/src/lib/datetime'
import { TaskActualItem } from '@/src/features/schedule/day/types'

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

export interface GroupedTasks<T> {
  planned: Map<number, PositionedTask<T>[]>
  actual: Map<number, PositionedTask<T>[]>
}

export function groupTasksByHour<T extends TimeRange>(tasks: T[], date: string): GroupedTasks<T> {
  const planned = new Map<number, PositionedTask<T>[]>()
  const actual = new Map<number, PositionedTask<T>[]>()

  for (const task of tasks) {
    // planned는 항상 렌더 (actual 유무와 무관)
    splitByHour(task, task.plannedStartAt, task.plannedEndAt, false, planned, date)

    // actual은 존재할 때만
    if (task.actual) {
      splitByHour(task, task.actual.actualStartAt, task.actual.actualEndAt, true, actual, date)
    }
  }

  return { planned, actual }
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

// utils/timeTable.ts

// 내부 핵심 로직만 분리
export function splitByHourRaw<T>(
  task: T,
  startIso: string,
  endIso: string,
  isDone: boolean,
  map: Map<number, PositionedTask<T>[]>,
  viewDate: string
) {
  const startMin = utcIsoToKstMinutes(startIso)
  let endMin = utcIsoToKstMinutes(endIso)

  // viewDate 기준 오버나이트 감지
  const kstStartDateStr = utcIsoToKstDateStr(startIso) // 아래 유틸 추가
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

// lib/datetime.ts
export function utcIsoToKstDateStr(iso: string): string {
  const date = new Date(iso + 'Z')
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  return [
    kst.getUTCFullYear(),
    String(kst.getUTCMonth() + 1).padStart(2, '0'),
    String(kst.getUTCDate()).padStart(2, '0'),
  ].join('-')
}

export function groupActualsByHour(
  actuals: TaskActualItem[],
  date: string
): Map<number, PositionedTask<TaskActualItem>[]> {
  const map = new Map<number, PositionedTask<TaskActualItem>[]>()

  for (const actual of actuals) {
    splitByHourRaw(
      // ✅ 오버나이트 처리 포함된 공통 함수 사용
      actual,
      actual.actualStartAt,
      actual.actualEndAt,
      true,
      map,
      date
    )
  }

  return map
}
