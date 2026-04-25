'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Input } from '@/src/components/common/Input'
import { ColorPicker } from './ColorPicker'
import { useColors } from '../hooks/useColors'
import { useUpdateGoalCategory } from '../hooks/useGoalCategoryMutations'
import { GoalCategory, GoalCategoryStatus } from '../api/goalCategory'
import { AddColorInput } from '@/src/features/category/components/AddColorInput'
import Label from '@/src/components/common/Label'

const STATUS_OPTIONS = [
  { value: 'NOT_STARTED', label: '시작 전' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'COMPLETED', label: '완료' },
  { value: 'STOPPED', label: '중단' },
] as const

interface GoalCategoryEditModalProps {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

interface FormState {
  goalCategoryName: string
  goalCategoryStatus: GoalCategoryStatus
  goalCategoryStartDate: string
  colorId: number | null
}

export function GoalCategoryEditModal({ isOpen, onClose, category }: GoalCategoryEditModalProps) {
  const { data: colors = [], isLoading: isColorsLoading } = useColors()
  const { mutate: updateGoalCategory, isPending } = useUpdateGoalCategory()

  const [form, setForm] = useState<FormState>({
    goalCategoryName: '',
    goalCategoryStatus: 'NOT_STARTED',
    goalCategoryStartDate: '',
    colorId: null,
  })
  const [nameError, setNameError] = useState('')

  // 모달 열릴 때 기존 값으로 초기화
  useEffect(() => {
    if (!isOpen) return

    // 기존 colorCode로 colorId 역매핑
    const matchedColor = colors.find((c) => c.colorCode === category.colorCode)

    setForm({
      goalCategoryName: category.goalCategoryName,
      goalCategoryStatus: category.goalCategoryStatus,
      goalCategoryStartDate: category.goalCategoryStartDate,
      colorId: matchedColor?.userColorId ?? null,
    })
    setNameError('')
  }, [isOpen, category, colors])

  const handleSubmit = () => {
    const trimmed = form.goalCategoryName.trim()
    if (!trimmed) {
      setNameError('목표 카테고리 이름을 입력해주세요')
      return
    }
    if (!form.colorId) {
      return // ColorPicker에서 시각적으로 처리
    }

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

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 카테고리 수정"
      footer={
        <div className="flex justify-end gap-2">
          <Button className="w-full" variant="secondary" size="lg" onClick={handleClose} disabled={isPending}>
            취소
          </Button>
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!form.goalCategoryName.trim() || !form.colorId}
          >
            저장하기
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* 이름 */}
        <Input
          label="목표 이름"
          isRequired={true}
          value={form.goalCategoryName}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, goalCategoryName: e.target.value }))
            if (nameError) setNameError('')
          }}
          placeholder="목표 카테고리 이름"
          error={nameError}
          maxLength={20}
        />

        {/* 상태 */}
        <div className="flex flex-col gap-1.5">
          <Label isRequired={true}>진행 상태</Label>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <Button
                variant={form.goalCategoryStatus === opt.value ? 'primary' : 'outline'}
                key={opt.value}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    goalCategoryStatus: opt.value,
                  }))
                }
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 시작일 */}
        <Input
          label="시작일"
          isRequired={true}
          type="date"
          value={form.goalCategoryStartDate}
          onChange={(e) => setForm((prev) => ({ ...prev, goalCategoryStartDate: e.target.value }))}
        />

        {/* 색상 */}
        <div className="flex flex-col gap-1.5">
          <Label isRequired={true}>색상</Label>
          <ColorPicker
            colors={colors}
            isLoading={isColorsLoading}
            selectedColorId={form.colorId}
            onSelect={(colorId) => setForm((prev) => ({ ...prev, colorId }))}
          />
          <AddColorInput
            existingColors={colors}
            onAdded={(newColor) => setForm((prev) => ({ ...prev, colorId: newColor.userColorId }))}
          />
        </div>
      </div>
    </Modal>
  )
}
