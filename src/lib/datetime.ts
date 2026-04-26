/** datetime-local input 값 → UTC ISO (서버 전송용) */
export function localInputToUtc(local: string): string {
  const [datePart, timePart] = local.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  const kstDate = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
  const utcMs = kstDate.getTime() - 9 * 60 * 60 * 1000
  return new Date(utcMs).toISOString().slice(0, 19)
}

/** UTC ISO → datetime-local input 값 (input 표시용) */
export function utcToLocalInput(iso: string): string {
  const d = new Date(iso + 'Z')
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 16)
}

/** UTC ISO → KST 시:분 표시 */
export function utcIsoToKstTimeLabel(iso: string): string {
  return new Date(iso + 'Z').toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

/** UTC ISO → KST 분 단위 (시간표 계산용) */
export function utcIsoToKstMinutes(iso: string): number {
  const d = new Date(iso + 'Z')
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.getUTCHours() * 60 + kst.getUTCMinutes()
}

/** Date 객체 → "YYYY-MM-DD" (로컬 기준, timezone 안전) */
export function formatLocalDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}
