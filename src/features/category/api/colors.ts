import { apiCallServer } from '@/src/lib/api.server'

export interface Color {
  colorId: number
  colorCode: string
}

export interface ColorRequest {
  colorCode: string
}

export async function getColors(): Promise<Color[]> {
  const result = await apiCallServer<Color[]>('/v1/colors')
  if (!result.success) throw new Error(result.error ?? '색상 목록 조회 실패')
  return result.data ?? []
}

export async function createColors(body: ColorRequest): Promise<Color> {
  const result = await apiCallServer<Color>('/v1/colors', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '컬러 생성 실패')
  return result.data!
}
