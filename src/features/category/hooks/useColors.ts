import { useQuery } from '@tanstack/react-query'
import { Color } from '@/src/features/category/api/colors'

async function fetchColors(): Promise<Color[]> {
  const res = await fetch('/api/colors')
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '색상 조회 실패')
  return json.data
}

export function useColors() {
  return useQuery({
    queryKey: ['colors'],
    queryFn: fetchColors,
    staleTime: Infinity,
  })
}
