'use client'

import { useState } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { Dropdown, DropdownOption } from '@/src/components/common/Dropdown'
import { DateTimePicker } from '@/src/components/common/DateTimePicker'
import { TASK_PRIORITIES, TaskPriority, UpdateTaskBody } from '@/src/features/task/types'
import { Task } from '@/src/features/schedule/day/types'
import { localInputToUtc, utcToLocalInput } from '@/src/lib/datetime'
import Label from '@/src/components/common/Label'

interface Props {
  task: Task
  onClose: () => void
}

export function TaskEditModal({ task, onClose }: Props) {
  const { mutate, isPending } = useUpdateTask()
  const { data: goalCategories = [], isLoading: isLoadingCategories } = useGoalCategories()

  const [taskName, setTaskName] = useState(task.taskName)
  const [priority, setPriority] = useState<TaskPriority>(task.taskPriority as TaskPriority)
  const [plannedStartAt, setPlannedStartAt] = useState(utcToLocalInput(task.plannedStartAt))
  const [plannedEndAt, setPlannedEndAt] = useState(utcToLocalInput(task.plannedEndAt))
  const [goalCategoryId, setGoalCategoryId] = useState<number | null>(task.goalCategoryId ?? null)
  const [generalCategoryId, setGeneralCategoryId] = useState<number | null>(task.generalCategoryId ?? null)

  const generalCategories = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)?.generalCategories ?? []

  const goalOptions: DropdownOption<number>[] = goalCategories.map((g) => ({
    label: g.goalCategoryName,
    value: g.goalCategoryId,
  }))

  const generalOptions: DropdownOption<number>[] = generalCategories.map((g) => ({
    label: g.generalCategoryName,
    value: g.generalCategoryId,
  }))

  const isValid =
    taskName.trim().length > 0 && plannedStartAt < plannedEndAt && goalCategoryId !== null && generalCategoryId !== null

  function handleGoalChange(id: number) {
    setGoalCategoryId(id)
    setGeneralCategoryId(null)
  }

  function handleSubmit() {
    if (!isValid) return

    const body: UpdateTaskBody = {
      taskName: taskName.trim(),
      taskPriority: priority,
      plannedStartAt: localInputToUtc(plannedStartAt),
      plannedEndAt: localInputToUtc(plannedEndAt),
      goalCategoryId: goalCategoryId!,
      generalCategoryId: generalCategoryId!,
      defaultSettingStatus: false,
    }

    mutate({ taskId: task.taskId, body }, { onSuccess: onClose })
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="할 일 수정"
      size="md"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="w-full" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            isLoading={isPending}
            disabled={!isValid}
          >
            저장
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="할 일"
          isRequired
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="할 일을 입력하세요"
          clearable
          onClear={() => setTaskName('')}
          error={taskName.trim().length === 0 ? '할 일을 입력해주세요' : undefined}
        />

        <Dropdown
          label="목표"
          isRequired
          options={goalOptions}
          value={goalCategoryId}
          onChange={handleGoalChange}
          placeholder={isLoadingCategories ? '불러오는 중...' : '목표를 선택해주세요'}
          disabled={isLoadingCategories}
        />

        <Dropdown
          label="일반 카테고리"
          isRequired
          options={generalOptions}
          value={generalCategoryId}
          onChange={(v) => setGeneralCategoryId(v)}
          placeholder={
            !goalCategoryId
              ? '목표를 먼저 선택해주세요'
              : generalCategories.length === 0
                ? '등록된 카테고리가 없어요'
                : '일반 카테고리를 선택해주세요'
          }
          disabled={!goalCategoryId || generalCategories.length === 0}
        />

        {/* 우선순위 */}
        <div className="flex flex-col gap-1.5">
          <Label>우선순위</Label>
          <div className="flex gap-2">
            {TASK_PRIORITIES.map((p) => (
              <Button
                key={p}
                type="button"
                className="w-full"
                variant={priority === p ? 'primary' : 'outline'}
                size="md"
                onClick={() => setPriority(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        <DateTimePicker label="시작 시간" isRequired value={plannedStartAt} onChange={setPlannedStartAt} />
        <DateTimePicker
          label="종료 시간"
          isRequired
          value={plannedEndAt}
          onChange={setPlannedEndAt}
          error={plannedStartAt >= plannedEndAt ? '종료 시간을 확인해주세요' : undefined}
        />
      </div>
    </Modal>
  )
}
