'use client'

import { useState } from 'react'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import { Modal } from '@/src/components/common/Modal'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'
import { cn } from '@/src/lib/utils'
import { DAY_OF_WEEK_OPTIONS, TASK_PRIORITIES, TaskPriority, UpdateTaskBody } from '@/src/features/task/types'
import { Task } from '@/src/features/schedule/day/types'
import { localInputToUtc, utcToLocalInput } from '@/src/lib/datetime'

const DAY_NAME_TO_ID: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
}

function toDayOfWeekIds(dayNames: string[]): number[] {
  return dayNames.map((name) => DAY_NAME_TO_ID[name]).filter(Boolean)
}

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
  const [dayOfWeekIds, setDayOfWeekIds] = useState<number[]>(toDayOfWeekIds(task.dayNames))

  const generalCategories = goalCategories.find((g) => g.goalCategoryId === goalCategoryId)?.generalCategories ?? []

  const isValid =
    taskName.trim().length > 0 && plannedStartAt < plannedEndAt && goalCategoryId !== null && generalCategoryId !== null

  function handleGoalChange(id: number | null) {
    setGoalCategoryId(id)
    setGeneralCategoryId(null)
  }

  function toggleDayOfWeek(id: number) {
    setDayOfWeekIds((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]))
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
      dayOfWeekIds,
      defaultSettingStatus: dayOfWeekIds.length > 0,
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
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" className="flex-1" onClick={handleSubmit} isLoading={isPending} disabled={!isValid}>
            저장
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* 할 일 이름 */}
        <Input
          label="할 일"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="할 일을 입력하세요"
          clearable
          onClear={() => setTaskName('')}
          error={taskName.trim().length === 0 ? '할 일을 입력해주세요' : undefined}
          required
        />

        {/* 목표 카테고리 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-xs font-medium">
            목표 <span className="text-red-500">*</span>
          </label>
          <select
            value={goalCategoryId ?? ''}
            onChange={(e) => handleGoalChange(e.target.value ? Number(e.target.value) : null)}
            disabled={isLoadingCategories}
            className={cn(
              'bg-background text-foreground border-border h-9 w-full rounded-md border px-3 text-sm',
              'focus:border-foreground focus:ring-foreground transition-colors outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <option value="">목표를 선택해주세요</option>
            {goalCategories.map((goal) => (
              <option key={goal.goalCategoryId} value={goal.goalCategoryId}>
                {goal.goalCategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* 일반 카테고리 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-foreground text-xs font-medium">
            일반 카테고리 <span className="text-red-500">*</span>
          </label>
          <select
            value={generalCategoryId ?? ''}
            onChange={(e) => setGeneralCategoryId(e.target.value ? Number(e.target.value) : null)}
            disabled={!goalCategoryId || generalCategories.length === 0}
            className={cn(
              'bg-background text-foreground border-border h-9 w-full rounded-md border px-3 text-sm',
              'focus:border-foreground focus:ring-foreground transition-colors outline-none focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <option value="">
              {!goalCategoryId
                ? '목표를 먼저 선택해주세요'
                : generalCategories.length === 0
                  ? '등록된 카테고리가 없어요'
                  : '일반 카테고리를 선택해주세요'}
            </option>
            {generalCategories.map((general) => (
              <option key={general.generalCategoryId} value={general.generalCategoryId}>
                {general.generalCategoryName}
              </option>
            ))}
          </select>
        </div>

        {/* 우선순위 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-xs font-medium">우선순위</span>
          <div className="flex gap-2">
            {TASK_PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={cn(
                  'h-8 w-10 rounded-md text-xs font-semibold transition-colors',
                  priority === p
                    ? 'bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted border'
                )}
                aria-pressed={priority === p}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 시간 */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="시작 시간"
            type="datetime-local"
            value={plannedStartAt}
            onChange={(e) => setPlannedStartAt(e.target.value)}
          />
          <Input
            label="종료 시간"
            type="datetime-local"
            value={plannedEndAt}
            onChange={(e) => setPlannedEndAt(e.target.value)}
            error={plannedStartAt >= plannedEndAt ? '종료 시간을 확인해주세요' : undefined}
          />
        </div>

        {/* 반복 요일 */}
        <div className="flex flex-col gap-1.5">
          <span className="text-foreground text-xs font-medium">
            반복 요일
            <span className="text-muted-foreground ml-1 font-normal">(선택)</span>
          </span>
          <div className="flex gap-1.5">
            {DAY_OF_WEEK_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleDayOfWeek(id)}
                className={cn(
                  'h-8 flex-1 rounded-md text-xs font-medium transition-colors',
                  dayOfWeekIds.includes(id)
                    ? 'bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:bg-muted border'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
