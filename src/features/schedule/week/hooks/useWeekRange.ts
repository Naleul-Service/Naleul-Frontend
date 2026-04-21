export function useWeekRange(date: Date) {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - ((day + 6) % 7))

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  return {
    startDate: fmt(monday),
    endDate: fmt(sunday),
  }
}
