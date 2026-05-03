import { useEffect, useState } from 'react'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { useCompleteGoalCategory } from '@/src/features/category/hooks/useGoalCategoryMutations'

interface FormState {
  goalCategoryEndDate: string
  achievement: string
}

const today = () => new Date().toISOString().split('T')[0]

export function useGoalCategoryCompleteForm({
  isOpen,
  category,
  onClose,
}: {
  isOpen: boolean
  category: GoalCategory
  onClose: () => void
}) {
  const { mutate: completeGoalCategory, isPending } = useCompleteGoalCategory()

  const [form, setForm] = useState<FormState>({
    goalCategoryEndDate: today(),
    achievement: category.achievement ?? '',
  })
  const [errors, setErrors] = useState({ achievement: '' })

  useEffect(() => {
    if (!isOpen) return
    setForm({
      goalCategoryEndDate: today(),
      achievement: category.achievement ?? '',
    })
    setErrors({ achievement: '' })
  }, [isOpen, category])

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'achievement' && errors.achievement) setErrors({ achievement: '' })
  }

  function handleSubmit() {
    const trimmed = form.achievement.trim()
    if (!trimmed) {
      setErrors({ achievement: '달성 내용을 입력해주세요' })
      return
    }
    completeGoalCategory(
      {
        goalCategoryId: category.goalCategoryId,
        body: {
          goalCategoryEndDate: form.goalCategoryEndDate,
          achievement: trimmed,
        },
      },
      { onSuccess: onClose }
    )
  }

  function handleClose() {
    if (isPending) return
    onClose()
  }

  const isValid = !!form.goalCategoryEndDate && !!form.achievement.trim()

  return {
    form,
    errors,
    isPending,
    isValid,
    handleChange,
    handleSubmit,
    handleClose,
  }
}
