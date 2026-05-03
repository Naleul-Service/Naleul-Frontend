// ─── HSV ↔ HEX 변환 유틸 ──────────────────────────────────────────────────────

/** HSV(0-360, 0-1, 0-1) → "#RRGGBB" */
export function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const val = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(val * 255)
  }
  const r = f(5),
    g = f(3),
    b = f(1)
  return `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

/** "#RRGGBB" → HSV(0-360, 0-1, 0-1) */
export function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return [0, 0, 1]
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const s = max === 0 ? 0 : d / max
  return [h, s, max]
}
