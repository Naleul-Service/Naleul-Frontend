import { apiCallServer } from '@/src/lib/api.server'
import { Color, ColorRequest } from '../types'

export async function getColors(): Promise<Color[]> {
  const result = await apiCallServer<Color[]>('/v1/user-colors')
  if (!result.success) throw new Error(result.error ?? '색상 목록 조회 실패')
  return result.data ?? []
}

export async function createColors(body: ColorRequest): Promise<Color> {
  const result = await apiCallServer<Color>('/v1/user-colors', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  if (!result.success) throw new Error(result.error ?? '컬러 생성 실패')
  return result.data!
}

export async function deleteColor(colorId: number): Promise<void> {
  const result = await apiCallServer(`/v1/user-colors/${colorId}`, {
    method: 'DELETE',
  })
  if (!result.success) throw new Error(result.error ?? '색상 삭제 실패')
}
