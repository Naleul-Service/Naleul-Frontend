'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Modal } from '@/src/components/common/Modal'
import { Button } from '@/src/components/common/Button'
import { Input } from '@/src/components/common/Input'
import { useCompleteGoalCategory } from '../hooks/useGoalCategoryMutations'
import { GoalCategory } from '../api/goalCategory'
import Label from '@/src/components/common/Label'

interface GoalCategoryCompleteModalProps {
  isOpen: boolean
  onClose: () => void
  category: GoalCategory
}

interface FormState {
  goalCategoryEndDate: string
  achievement: string
}

const today = () => new Date().toISOString().split('T')[0]

export function GoalCategoryCompleteModal({ isOpen, onClose, category }: GoalCategoryCompleteModalProps) {
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

  const handleSubmit = () => {
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

  const handleClose = () => {
    if (isPending) return
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="목표 완료"
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
            disabled={!form.goalCategoryEndDate || !form.achievement.trim()}
            leftIcon={<CheckCircle size={13} />}
          >
            완료 처리
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* 안내 */}
        <div className="bg-muted rounded-lg px-3 py-2.5">
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-medium">{category.goalCategoryName}</span> 목표를 완료 처리해요.
            <br />
            완료 후에는 상태가 <span className="font-medium">완료</span>로 변경돼요.
          </p>
        </div>

        {/* 종료일 */}
        <Input
          label="종료일"
          type="date"
          value={form.goalCategoryEndDate}
          onChange={(e) => setForm((prev) => ({ ...prev, goalCategoryEndDate: e.target.value }))}
          min={category.goalCategoryStartDate}
        />

        {/* 달성 내용 */}
        <div className="flex flex-col gap-1.5">
          <Label isRequired={true}>달성 내용</Label>
          <textarea
            value={form.achievement}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, achievement: e.target.value }))
              if (errors.achievement) setErrors({ achievement: '' })
            }}
            placeholder="목표를 어떻게 달성했는지 기록해보세요"
            rows={3}
            maxLength={200}
            className={[
              'border-border bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-3 py-2.5 text-xs transition-colors outline-none',
              'focus:border-foreground',
              errors.achievement ? 'border-destructive' : '',
            ].join(' ')}
          />
          <div className="flex justify-between">
            {errors.achievement ? <p className="text-destructive text-xs">{errors.achievement}</p> : <span />}
            <p className="text-muted-foreground text-xs">{form.achievement.length}/200</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}
