import { ChartSlice } from '../types'

// recharts용 데이터 포맷으로 변환
export function toBarChartData(slices: ChartSlice[]) {
  return slices.map((s) => ({
    name: s.name,
    value: s.totalMinutes,
    percentage: s.percentage,
    fill: s.colorHex,
  }))
}

export function toPieChartData(slices: ChartSlice[]) {
  return slices.map((s) => ({
    name: s.name,
    value: s.totalMinutes,
    percentage: s.percentage,
    fill: s.colorHex,
  }))
}
