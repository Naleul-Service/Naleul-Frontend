'use client'

import { useState } from 'react'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useCreateGeneralCategory } from '@/src/features/category/hooks/useGeneralCategories'

export function useGeneralCategoryForm({ goalCategory, onClose }: { goalCategory: GoalCategory; onClose: () => void }) {
  const { mutate, isPending } = useCreateGeneralCategory()

  const [name, setName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setName('')
    setSelectedColorId(null)
    setError(null)
    onClose()
  }

  function handleSubmit() {
    if (!name.trim()) return setError('카테고리 이름을 입력해 주세요')
    if (!selectedColorId) return setError('색상을 선택해 주세요')

    setError(null)
    mutate(
      {
        generalCategoryName: name.trim(),
        goalCategoryId: goalCategory.goalCategoryId,
        colorId: selectedColorId,
      },
      { onSuccess: handleClose, onError: (err) => setError(err.message) }
    )
  }

  return {
    name,
    setName,
    selectedColorId,
    setSelectedColorId,
    error,
    isPending,
    handleClose,
    handleSubmit,
  }
}
