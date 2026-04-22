export interface ChartSlice {
  id: number
  name: string
  colorHex: string
  totalMinutes: number
  percentage: number
}

export interface ChartResponse {
  totalMinutes: number
  slices: ChartSlice[]
}

export interface GoalCategoryChart {
  goalCategoryId: number
  goalCategoryName: string
  colorHex: string
  totalMinutes: number
  generalCategories: ChartSlice[]
}
