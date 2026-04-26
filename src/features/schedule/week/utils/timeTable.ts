//schedule/week/utils/timeTable.ts

import { TaskActualItem } from '@/src/features/schedule/day/types'
import { PositionedTask, splitByHourRaw, utcIsoToKstDateStr } from '@/src/features/schedule/day/utils/timeTable'

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
