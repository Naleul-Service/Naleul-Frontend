import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Color, ColorRequest } from '@/src/features/category/api/colors'

async function postColor(body: ColorRequest): Promise<Color> {
  const res = await fetch('/api/colors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '색상 생성 실패')
  return json.data
}

export function useAddColor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (colorCode: string) => postColor({ colorCode }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] })
    },
  })
}
