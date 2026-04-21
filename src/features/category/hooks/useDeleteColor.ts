import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteColorRequest(colorId: number): Promise<void> {
  const res = await fetch(`/api/colors/${colorId}`, { method: 'DELETE' })
  const json = await res.json()
  if (!json.success) throw new Error(json.error ?? '색상 삭제 실패')
}

export function useDeleteColor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteColorRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['colors'] })
    },
  })
}
