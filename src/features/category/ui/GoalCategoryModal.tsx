'use client'

import { useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { useCreateGoalCategory } from '@/src/features/category/hooks/useGoalCategories'
import Label from '@/src/components/common/Label'
import { DatePicker } from '@/src/components/common/picker/DatePicker'
import { getDefaultStartDate } from '@/src/features/category/utils/category'
import { useColors } from '@/src/features/color/hooks/useColors'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'

interface GoalCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GoalCategoryModal({ isOpen, onClose }: GoalCategoryModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { mutate, isPending } = useCreateGoalCategory()

  const [name, setName] = useState('')
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [startDate, setStartDate] = useState(() => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  })

  const handleClose = () => {
    setName('')
    setSelectedColorId(null)
    setStartDate(getDefaultStartDate())
    setError(null)
    onClose()
  }

  const handleSubmit = () => {
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 카테고리 추가"
      description="목표를 담을 카테고리를 만들어요"
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button className="w-full" variant="primary" size="lg" onClick={handleSubmit} isLoading={isPending}>
            만들기
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label="카테고리명"
          isRequired
          placeholder="예) 건강, 자기계발, 재테크"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 시작일 — DateTimePicker로 교체 */}
        <DatePicker label="시작일" isRequired value={startDate} onChange={setStartDate} />

        <div className="flex flex-col gap-2">
          <Label isRequired>색상</Label>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={selectedColorId}
            onSelect={setSelectedColorId}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </Modal>
  )
}
