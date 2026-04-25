// src/features/schedule/day/utils/timeTable.ts 에 추가

import { TaskActualItem } from '@/src/features/schedule/day/types'
import { utcIsoToKstMinutes } from '@/src/lib/datetime'
import { PositionedTask } from '@/src/features/schedule/day/utils/timeTable'

export function groupActualsByHour(
  actuals: TaskActualItem[],
  date: string
): Map<number, PositionedTask<TaskActualItem>[]> {
  const map = new Map<number, PositionedTask<TaskActualItem>[]>()

  for (const actual of actuals) {
    const startMin = utcIsoToKstMinutes(actual.actualStartAt)
    let endMin = utcIsoToKstMinutes(actual.actualEndAt)
    if (endMin <= startMin) endMin += 24 * 60

    const clampedEnd = Math.min(endMin, 24 * 60)
    const startHour = Math.floor(startMin / 60)
    const endHour = clampedEnd % 60 === 0 ? clampedEnd / 60 - 1 : Math.floor(clampedEnd / 60)

    for (let hour = startHour; hour <= endHour; hour++) {
      const slotStart = hour * 60
      const slotEnd = slotStart + 60
      const segStart = Math.max(startMin, slotStart)
      const segEnd = Math.min(clampedEnd, slotEnd)
      const leftPercent = ((segStart - slotStart) / 60) * 100
      const widthPercent = Math.max(((segEnd - segStart) / 60) * 100, 4)

      if (!map.has(hour)) map.set(hour, [])
      map.get(hour)!.push({
        task: actual,
        leftPercent,
        widthPercent,
        hour,
        isDone: true,
      })
    }
  }

  return map
}
