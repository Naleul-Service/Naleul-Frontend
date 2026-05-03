import { useEffect, useState } from 'react'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { useUpdateGeneralCategory } from '@/src/features/category/hooks/useGeneralCategoryMutations'
import { Color } from '@/src/features/color/types'

interface FormState {
  generalCategoryName: string
  colorId: number | null
}

export function useGeneralCategoryEditForm({
  isOpen,
  item,
  goalCategory,
  colors,
  onClose,
}: {
  isOpen: boolean
  item: GeneralCategoryItemType
  goalCategory: GoalCategory
  colors: Color[]
  onClose: () => void
}) {
  const { mutate: updateGeneralCategory, isPending } = useUpdateGeneralCategory()

  const [form, setForm] = useState<FormState>({ generalCategoryName: '', colorId: null })
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const matchedColor = colors.find((c) => c.colorCode === item.colorCode)
    setForm({
      generalCategoryName: item.generalCategoryName,
      colorId: matchedColor?.userColorId ?? null,
    })
    setNameError('')
  }, [isOpen, item, colors])

  function handleChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (key === 'generalCategoryName' && nameError) setNameError('')
  }

  function handleSubmit() {
    const trimmed = form.generalCategoryName.trim()
    if (!trimmed) {
      setNameError('일반 카테고리 이름을 입력해주세요')
      return
    }
    if (!form.colorId) return

    updateGeneralCategory(
      {
        generalCategoryId: item.generalCategoryId,
        body: {
          generalCategoryName: trimmed,
          goalCategoryId: goalCategory.goalCategoryId,
          colorId: form.colorId,
        },
      },
      { onSuccess: onClose }
    )
  }

  function handleClose() {
    if (isPending) return
    onClose()
  }

  const isValid = !!form.generalCategoryName.trim() && !!form.colorId

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
