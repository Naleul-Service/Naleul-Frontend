'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ScheduleTabBarContainer } from '@/src/features/schedule/components/ScheduleTabBarContainer'
import { CalendarPopover } from '@/src/features/schedule/components/CalendarPopover'
import { FilterIcon } from '@/src/assets/svgComponents'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'
import { CreateTaskActualModal } from '@/src/features/schedule/day/components/CreateTaskActualModal'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { useSearchParams } from 'next/navigation'

export default function SchedulePageLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate) // 공통으로 사용할 날짜 문자열

  const tableParams = {
    date: dateString,
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateTaskActualModalOpen, setIsCreateTaskActualModalOpen] = useState(false)
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ScheduleTabBarContainer />
          <div className="rounded-[8px] border border-gray-100">
            <FilterIcon width={32} height={32} />
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <CalendarPopover />
          <Button
            size="md"
            variant="secondary"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateTaskActualModalOpen(true)}
          >
            실제로 한 일 추가
          </Button>
          <Button size="md" leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            할 일 추가
          </Button>
        </div>
      </div>
      {children}
      
      {/* 할 일 계획 모달 */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${dateString}T09:00`} />

      {/* 실제 기록 추가 모달 */}
      <CreateTaskActualModal
        isOpen={isCreateTaskActualModalOpen}
        onClose={() => setIsCreateTaskActualModalOpen(false)}
        date={dateString} // invalidateQuery에 사용될 날짜
        defaultDate={`${dateString}T12:00`} // 기본 시작 시간을 낮 12시 등으로 설정
      />
    </div>
  )
}
