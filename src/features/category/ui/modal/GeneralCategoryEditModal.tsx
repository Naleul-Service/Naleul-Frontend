'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Input } from '@/src/components/common/Input'
import Label from '@/src/components/common/Label'
import { GeneralCategoryItemType, GoalCategory } from '@/src/features/category/api/goalCategory'
import { useUpdateGeneralCategory } from '@/src/features/category/hooks/useGeneralCategoryMutations'
import { ColorPicker } from '@/src/features/color/ui/ColorPicker'
import { useColors } from '@/src/features/color/hooks/useColors'

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
      colorId: matchedColor?.userColorId ?? null,
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
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button
            className="w-full"
            size="lg"
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
          isRequired={true}
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
          <Label isRequired={true}>색상</Label>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={form.colorId}
            onSelect={(colorId) => setForm((prev) => ({ ...prev, colorId }))}
          />
        </div>
      </div>
    </Modal>
  )
}
