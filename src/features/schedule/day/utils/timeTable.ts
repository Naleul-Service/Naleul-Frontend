/**
 * 시간 테이블 관련 순수 함수 모음
 * 컴포넌트 의존성 없음 — 테스트 가능
 */

export const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => i) // 0~23

/** "09:00" 형태 레이블 */
export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

/** ISO string → 로컬 기준 분(0~1439) */
export function isoToMinutes(iso: string): number {
  const d = new Date(iso)
  return d.getHours() * 60 + d.getMinutes()
}

export interface PositionedTask<T> {
  task: T
  leftPercent: number // 시간 슬롯(1h) 내 좌측 오프셋 %
  widthPercent: number // 시간 슬롯(1h) 내 너비 %
  hour: number // 속하는 시(0~23)
}

interface TimeRange {
  plannedStartAt: string
  plannedEndAt: string
}

/**
 * 태스크를 시간대별로 그룹핑하고 가로 위치 계산
 * - 하나의 태스크가 두 hour에 걸칠 경우 시작 hour에서 자름 (단순화)
 */
export function groupTasksByHour<T extends TimeRange>(tasks: T[]): Map<number, PositionedTask<T>[]> {
  const map = new Map<number, PositionedTask<T>[]>()

  for (const task of tasks) {
    const startMin = isoToMinutes(task.plannedStartAt)
    const endMin = isoToMinutes(task.plannedEndAt)
    const hour = Math.floor(startMin / 60)
    const slotStart = hour * 60

    const leftPercent = ((startMin - slotStart) / 60) * 100
    const clampedEnd = Math.min(endMin, slotStart + 60)
    const widthPercent = Math.max(((clampedEnd - startMin) / 60) * 100, 4) // 최소 4%

    if (!map.has(hour)) map.set(hour, [])
    map.get(hour)!.push({ task, leftPercent, widthPercent, hour })
  }

  return map
}

/** generalCategoryId → 고정 색상 (백엔드 color 필드 추가되면 이 함수만 교체) */
const PALETTE = [
  { bg: '#E3F0FF', dot: '#3B82F6', text: '#1E3A5F' }, // blue
  { bg: '#E8F5E9', dot: '#22C55E', text: '#14532D' }, // green
  { bg: '#FFF3E0', dot: '#F59E0B', text: '#78350F' }, // amber
  { bg: '#FCE4EC', dot: '#EC4899', text: '#831843' }, // pink
  { bg: '#F3E8FF', dot: '#A855F7', text: '#4A1D96' }, // purple
  { bg: '#E0F7FA', dot: '#06B6D4', text: '#164E63' }, // cyan
  { bg: '#FFF9C4', dot: '#EAB308', text: '#713F12' }, // yellow
  { bg: '#FFE4E1', dot: '#EF4444', text: '#7F1D1D' }, // red
]

export function getCategoryColor(id: number | null) {
  const idx = id == null ? 0 : Math.abs(id) % PALETTE.length
  return PALETTE[idx]
}
