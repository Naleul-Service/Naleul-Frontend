import { useEffect, useState } from 'react'
import { GoalCategory, GoalCategoryStatus } from '@/src/features/category/api/goalCategory'
import { useUpdateGoalCategory } from '@/src/features/category/hooks/useGoalCategoryMutations'
import { Color } from '@/src/features/color/types'

interface FormState {
  goalCategoryName: string
  goalCategoryStatus: GoalCategoryStatus
  goalCategoryStartDate: string
  colorId: number | null
}

export function useGoalCategoryEditForm({
  isOpen,
  category,
  colors,
  onClose,
}: {
  isOpen: boolean
  category: GoalCategory
  colors: Color[]
  onClose: () => void
}) {
  const { mutate: updateGoalCategory, isPending } = useUpdateGoalCategory()

  const [form, setForm] = useState<FormState>({
    goalCategoryName: '',
    goalCategoryStatus: 'NOT_STARTED',
    goalCategoryStartDate: '',
    colorId: null,
  })
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const matchedColor = colors.find((c) => c.colorCode === category.colorCode)
    setForm({
      goalCategoryName: category.goalCategoryName,
      goalCategoryStatus: category.goalCategoryStatus,
      goalCategoryStartDate: category.goalCategoryStartDate,
      colorId: matchedColor?.userColorId ?? null,
    })
    setNameError('')
  }, [isOpen, category, colors])

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'goalCategoryName' && nameError) setNameError('')
  }

  function handleSubmit() {
    const trimmed = form.goalCategoryName.trim()
    if (!trimmed) {
      setNameError('목표 카테고리 이름을 입력해주세요')
      return
    }
    if (!form.colorId) return

    updateGoalCategory(
      {
        goalCategoryId: category.goalCategoryId,
        body: {
          colorId: form.colorId,
          goalCategoryName: trimmed,
          goalCategoryStatus: form.goalCategoryStatus,
          goalCategoryStartDate: form.goalCategoryStartDate,
        },
      },
      { onSuccess: onClose }
    )
  }

  function handleClose() {
    if (isPending) return
    onClose()
  }

  const isValid = !!form.goalCategoryName.trim() && !!form.colorId

  return {
    form,
    nameError,
    isPending,
    isValid,
    handleChange,
    handleSubmit,
    handleClose,
  }
}
