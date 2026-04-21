'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useColors } from '@/src/features/category/hooks/useColors'
import { useCreateGoalCategory } from '@/src/features/category/hooks/useGoalCategories'
import { ColorPicker } from './ColorPicker'
import { AddColorInput } from '@/src/features/category/components/AddColorInput'

interface GoalCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GoalCategoryModal({ isOpen, onClose }: GoalCategoryModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { mutate, isPending } = useCreateGoalCategory()

  const [name, setName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0])
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setName('')
    setSelectedColorId(null)
    setStartDate(new Date().toISOString().split('T')[0])
    setError(null)
    onClose()
  }

  const handleSubmit = () => {
    if (!name.trim()) return setError('카테고리 이름을 입력해 주세요')
    if (!selectedColorId) return setError('색상을 선택해 주세요')

    setError(null)
    mutate(
      {
        colorId: selectedColorId,
        goalCategoryName: name.trim(),
        goalCategoryStatus: 'NOT_STARTED',
        goalCategoryStartDate: startDate,
      },
      { onSuccess: handleClose, onError: (err) => setError(err.message) }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 카테고리 추가"
      description="목표를 담을 카테고리를 만들어요"
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
          placeholder="예) 건강, 자기계발, 재테크"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input label="시작일" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        <div className="flex flex-col gap-2">
          <p className="text-foreground text-xs font-medium">
            색상 <span className="text-red-500">*</span>
          </p>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={selectedColorId}
            onSelect={setSelectedColorId}
          />
          <AddColorInput existingColors={colors} onAdded={(newColor) => setSelectedColorId(newColor.colorId)} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  )
}
