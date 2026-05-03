import { useState } from 'react'
import { useCreateGoalCategory } from '@/src/features/category/hooks/useGoalCategories'
import { getDefaultStartDate } from '@/src/features/category/utils/category'

export function useGoalCategoryForm(onSuccess: () => void) {
  const { mutate, isPending } = useCreateGoalCategory()

  const [name, setName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState(getDefaultStartDate)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setName('')
    setSelectedColorId(null)
    setStartDate(getDefaultStartDate())
    setError(null)
    onSuccess()
  }

  function handleSubmit() {
    if (!name.trim()) return setError('카테고리 이름을 입력해 주세요')
    if (!selectedColorId) return setError('색상을 선택해 주세요')
    if (!startDate) return setError('시작일을 입력해 주세요')

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selected = new Date(startDate)
    selected.setHours(0, 0, 0, 0)
    const goalCategoryStatus = selected > today ? 'NOT_STARTED' : 'IN_PROGRESS'

    setError(null)
    mutate(
      {
        colorId: selectedColorId,
        goalCategoryName: name.trim(),
        goalCategoryStatus,
        goalCategoryStartDate: startDate,
      },
      { onSuccess: handleClose, onError: (err) => setError(err.message) }
    )
  }

  return {
    name,
    setName,
    selectedColorId,
    setSelectedColorId,
    startDate,
    setStartDate,
    error,
    isPending,
    handleClose,
    handleSubmit,
  }
}
