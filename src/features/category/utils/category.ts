export function getDefaultStartDate(): string {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  const meridiem = h < 12 ? 'AM' : 'PM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(hour12)}:${pad(m)}`
}
