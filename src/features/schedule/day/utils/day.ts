export const DAY_OF_WEEK = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

/** Date → 요일 영문 대문자 */
export function getDayOfWeek(date: Date): string {
  return DAY_OF_WEEK[date.getDay()]
}

const DAY_NAMES = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'] as const

export function toDayOfWeek(date: Date): string {
  return DAY_NAMES[date.getDay()]
}

/** searchParams의 date 문자열 → Date 객체. 없거나 잘못된 값이면 오늘 반환 */
export function parseDateParam(dateParam: string | null): Date {
  if (!dateParam) return new Date()
  const parsed = new Date(dateParam)
  return isNaN(parsed.getTime()) ? new Date() : parsed
}

/** Date → 'yyyy-MM-dd' */
export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}
