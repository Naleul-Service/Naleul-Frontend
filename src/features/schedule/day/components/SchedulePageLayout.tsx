'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { ScheduleTabBarContainer } from '@/src/features/schedule/components/ScheduleTabBarContainer'
import { CalendarPopover } from '@/src/features/schedule/components/CalendarPopover'
import { Button } from '@/src/components/common/Button'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { useGoalCategories } from '@/src/features/category/hooks/useGoalCategories'
import PageHeader from '@/src/components/layout/PageHeader'
import { TaskFilterPopover } from '@/src/features/schedule/day/components/TaskFilterPopover'
import { useTaskFilter } from '@/src/features/schedule/day/hooks/useTaskFilter'
import { CreateTaskActualModal } from '@/src/features/task/ui/modal/CreateTaskActualModal'
import { AddTaskModal } from '@/src/features/task/ui/modal/AddTaskModal'

export default function SchedulePageLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate)

  const { filter, setPriority, setGoalCategory, setGeneralCategory } = useTaskFilter()
  const { data: goalCategories = [] } = useGoalCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateTaskActualModalOpen, setIsCreateTaskActualModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 p-5">
      <PageHeader title="일정 관리" subtitle="할 일을 작성하고 관리할 수 있어요." />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ScheduleTabBarContainer />
          <TaskFilterPopover
            filter={filter}
            goalCategories={goalCategories}
            onPriorityChange={setPriority}
            onGoalCategoryChange={setGoalCategory}
            onGeneralCategoryChange={setGeneralCategory}
          />
        </div>

        <div className="flex items-center gap-x-3">
          <CalendarPopover />
          <Button
            size="md"
            variant="secondary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateTaskActualModalOpen(true)}
          >
            실행 완료 추가
          </Button>
          <Button size="md" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            할 일 추가
          </Button>
        </div>
      </div>

      {/* filter를 children에게 내려줘야 하면 Context 고려 */}
      {children}

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${dateString}T09:00`} />
      <CreateTaskActualModal
        isOpen={isCreateTaskActualModalOpen}
        onClose={() => setIsCreateTaskActualModalOpen(false)}
        date={dateString}
        defaultDate={`${dateString}T12:00`}
      />
    </div>
  )
}
