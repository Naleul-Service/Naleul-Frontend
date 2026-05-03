//schedule/week/utils/timeTable.ts

import { PositionedTask, splitByHourRaw, utcIsoToKstDateStr } from '@/src/features/schedule/day/utils/timeTable'
import { Task, TaskActualItem } from '@/src/features/task/types'

export function groupActualsByHour(
  actuals: TaskActualItem[],
  date: string
): Map<number, PositionedTask<TaskActualItem>[]> {
  const map = new Map<number, PositionedTask<TaskActualItem>[]>()

  for (const actual of actuals) {
    const startDateStr = utcIsoToKstDateStr(actual.actualStartAt)
    const endDateStr = utcIsoToKstDateStr(actual.actualEndAt)

    // 이 날짜와 전혀 무관한 데이터는 skip
    if (startDateStr !== date && endDateStr !== date) continue

    splitByHourRaw(actual, actual.actualStartAt, actual.actualEndAt, true, map, date)
  }

  return map
}

export function groupPlannedByHour(tasks: Task[], date: string): Map<number, PositionedTask<Task>[]> {
  const map = new Map<number, PositionedTask<Task>[]>()

  for (const task of tasks) {
    // actual이 있으면 skip (actualData에서 렌더됨)
    if (task.actual !== null) continue

    splitByHourRaw(task, task.plannedStartAt, task.plannedEndAt, false, map, date)
  }

  return map
}
