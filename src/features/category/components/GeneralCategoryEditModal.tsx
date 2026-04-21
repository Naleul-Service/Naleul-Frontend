'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Input } from '@/src/components/common/Input'
import { ColorPicker } from './ColorPicker'
import { useColors } from '../hooks/useColors'
import { useUpdateGeneralCategory } from '../hooks/useGeneralCategoryMutations'
import { GeneralCategoryItemType, GoalCategory } from '../api/goalCategory'
import { AddColorInput } from '@/src/features/category/components/AddColorInput'

interface GeneralCategoryEditModalProps {
  isOpen: boolean
  onClose: () => void
  item: GeneralCategoryItemType
  goalCategory: GoalCategory // 소속 목표 카테고리 (goalCategoryId 전달용)
}

interface FormState {
  generalCategoryName: string
  colorId: number | null
}

export function GeneralCategoryEditModal({ isOpen, onClose, item, goalCategory }: GeneralCategoryEditModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { mutate: updateGeneralCategory, isPending } = useUpdateGeneralCategory()

  const [form, setForm] = useState<FormState>({ generalCategoryName: '', colorId: null })
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    const matchedColor = colors.find((c) => c.colorCode === item.colorCode)
    setForm({
      generalCategoryName: item.generalCategoryName,
      colorId: matchedColor?.colorId ?? null,
    })
    setNameError('')
  }, [isOpen, item, colors])

  const handleSubmit = () => {
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

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="일반 카테고리 수정"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!form.generalCategoryName.trim() || !form.colorId}
          >
            저장하기
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="카테고리 이름"
          value={form.generalCategoryName}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, generalCategoryName: e.target.value }))
            if (nameError) setNameError('')
          }}
          placeholder="일반 카테고리 이름"
          error={nameError}
          maxLength={20}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-xs font-medium">색상</label>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={form.colorId}
            onSelect={(colorId) => setForm((prev) => ({ ...prev, colorId }))}
          />
          <AddColorInput
            existingColors={colors}
            onAdded={(newColor) => setForm((prev) => ({ ...prev, colorId: newColor.colorId }))}
          />
        </div>
      </div>
    </Modal>
  )
}
