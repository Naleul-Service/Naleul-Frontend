// 해당 월의 캘린더 그리드에 필요한 날짜 배열 반환 (이전/다음 월 포함)

import { Task } from '@/src/features/task/types'

export function buildCalendarDays(year: number, month: number): Date[] {
  // month: 1-indexed
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)

  // 일요일 시작 기준 (0=일 ~ 6=토)
  const startOffset = firstDay.getDay()
  const endOffset = 6 - lastDay.getDay()

  const days: Date[] = []

  for (let i = startOffset; i > 0; i--) {
    days.push(new Date(year, month - 1, 1 - i))
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month - 1, d))
  }
  for (let i = 1; i <= endOffset; i++) {
    days.push(new Date(year, month, i))
  }

  return days
}

export function toDateKey(date: Date): string {
  // toISOString() 쓰면 UTC 변환으로 KST에서 하루 밀림
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameMonth(date: Date, year: number, month: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month - 1
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return toDateKey(date) === toDateKey(today)
}

// 해당 월의 실제 날짜만 (1일~말일), 이전/다음 월 제외
export function getMonthDays(year: number, month: number): Date[] {
  const lastDay = new Date(year, month, 0).getDate()
  return Array.from({ length: lastDay }, (_, i) => new Date(year, month - 1, i + 1))
}

// 해당 날짜에 completed(actuals 있음)인 task가 하나라도 있는지
export function isDayCompleted(tasks: Task[]): boolean {
  return tasks.some((task) => task.actual !== null)
}

// completed된 task 중 첫 번째 색상 반환 (없으면 null)
export function getDayColor(tasks: Task[]): string | null {
  const completedTask = tasks.find((task) => task.actual !== null)
  return completedTask?.goalCategoryColorCode ?? null
}

export function buildCalendarGrid(year: number, month: number): (Date | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay() // 0=일
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks: (Date | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks // weeks[주차][요일]
}

export function getDayStatus(tasks: Task[]): { completed: boolean; color: string | null } {
  const completedTasks = tasks.filter(
    (t) => t.actual !== null && t.actual.actualDurationMinutes >= t.plannedDurationMinutes
  )

  return {
    completed: tasks.length > 0 && completedTasks.length === tasks.length,
    color: tasks[0]?.goalCategoryColorCode ?? tasks[0]?.generalCategoryColorCode ?? null,
  }
}
