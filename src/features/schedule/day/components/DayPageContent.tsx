'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/src/components/common/Button'
import { AddTaskModal } from '@/src/features/task/components/AddTaskModal'
import { DayTaskList } from '@/src/features/schedule/day/components/DayTaskList'
import { DailyTimeTable } from '@/src/features/schedule/day/components/DailyTimeTable'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import { CreateTaskActualModal } from '@/src/features/schedule/day/components/CreateTaskActualModal'

export function DayPageContent() {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate) // 공통으로 사용할 날짜 문자열

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateTaskActualModalOpen, setIsCreateTaskActualModalOpen] = useState(false)

  const tableParams = {
    date: dateString,
  }

  return (
    <main className="flex flex-col gap-4">
      {/* gap-x-[32px]를 적용하기 위해 grid와 2:3 비율 설정 */}
      <div
        className="grid w-full gap-x-[32px] overflow-y-auto px-1"
        style={{
          maxHeight: 'calc(100svh - 120px)',
          gridTemplateColumns: '2fr 3fr',
        }}
      >
        <div className="min-w-0">
          <DayTaskList date={selectedDate} />
        </div>
        <div className="min-w-0">
          <DailyTimeTable params={tableParams} />
        </div>
      </div>

      {/* 하단 플로팅 버튼 영역 */}
      <div className="fixed right-6 bottom-8 flex gap-x-3">
        <Button
          size="lg"
          variant="secondary" // 구분을 위해 색상 변경 제안 (선택사항)
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          할 일 추가
        </Button>
        <Button size="lg" leftIcon={<Plus size={16} />} onClick={() => setIsCreateTaskActualModalOpen(true)}>
          실제로 한 일 추가
        </Button>
      </div>

      {/* 할 일 계획 모달 */}
      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultDate={`${dateString}T09:00`} />

      {/* 실제 기록 추가 모달 */}
      <CreateTaskActualModal
        isOpen={isCreateTaskActualModalOpen}
        onClose={() => setIsCreateTaskActualModalOpen(false)}
        date={dateString} // invalidateQuery에 사용될 날짜
        defaultDate={`${dateString}T12:00`} // 기본 시작 시간을 낮 12시 등으로 설정
      />
    </main>
  )
}
