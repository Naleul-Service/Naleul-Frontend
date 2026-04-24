'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useColors } from '@/src/features/category/hooks/useColors'
import { useCreateGeneralCategory } from '@/src/features/category/hooks/useGeneralCategories'
import { GoalCategory } from '@/src/features/category/api/goalCategory'
import { ColorPicker } from './ColorPicker'
import { AddColorInput } from '@/src/features/category/components/AddColorInput'
import Label from '@/src/components/common/Label'

interface GeneralCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  goalCategory: GoalCategory
}

export function GeneralCategoryModal({ isOpen, onClose, goalCategory }: GeneralCategoryModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { mutate, isPending } = useCreateGeneralCategory()

  const [name, setName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setName('')
    setSelectedColorId(null)
    setError(null)
    onClose()
  }

  const handleSubmit = () => {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="일반 카테고리 추가"
      description={`"${goalCategory.goalCategoryName}" 하위 카테고리를 만들어요`}
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button onClick={handleSubmit} isLoading={isPending}>
            만들기
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="카테고리 이름"
          placeholder="예) 헬스, 독서, 저축"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className="flex flex-col gap-2">
          <Label isRequired={true}>색상</Label>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={selectedColorId}
            onSelect={setSelectedColorId}
          />
          <AddColorInput existingColors={colors} onAdded={(newColor) => setSelectedColorId(newColor.userColorId)} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  )
}
