// SchedulePageLayout.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { parseDateParam, toDateString } from '@/src/features/schedule/day/utils/day'
import PageHeader from '@/src/components/layout/PageHeader'
import { ScheduleHeader } from '@/src/features/schedule/components/ScheduleHeader'
import { ScheduleHeaderProvider, useScheduleHeader } from '@/src/features/schedule/context/ScheduleHeaderContext'
import { AddTaskModal } from '@/src/features/task/ui/modal/AddTaskModal'
import { CreateTaskActualModal } from '@/src/features/task/ui/modal/CreateTaskActualModal'
import { Button } from '@/src/components/common/Button'

function ScheduleModals({ dateString }: { dateString: string }) {
  const { isAddTaskOpen, closeAddTask, isAddTaskActualOpen, closeAddTaskActual } = useScheduleHeader()

  return (
    <>
      <AddTaskModal isOpen={isAddTaskOpen} onClose={closeAddTask} defaultDate={`${dateString}T09:00`} />
      <CreateTaskActualModal
        isOpen={isAddTaskActualOpen}
        onClose={closeAddTaskActual}
        date={dateString}
        defaultDate={`${dateString}T12:00`}
      />
    </>
  )
}

// 액션 버튼 — tablet/mobile 공용
function ScheduleActionButtons({ mobile = false }: { mobile?: boolean }) {
  const { openAddTask, openAddTaskActual } = useScheduleHeader()
  const size = mobile ? 'lg' : 'md'

  return (
    <>
      <Button
        size={size}
        variant="secondary"
        leftIcon={<Plus size={16} />}
        onClick={openAddTaskActual}
        className={mobile ? 'w-full' : ''}
      >
        실행 완료 추가
      </Button>
      <Button size={size} leftIcon={<Plus size={16} />} onClick={openAddTask} className={mobile ? 'w-full' : ''}>
        할 일 추가
      </Button>
    </>
  )
}

function SchedulePageContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const selectedDate = parseDateParam(searchParams.get('date'))
  const dateString = toDateString(selectedDate)

  return (
    // 모바일 하단 바 공간 확보
    <div className="tablet:pb-0 relative flex flex-col gap-6 p-5 pb-24">
      {/* PageHeader — 태블릿에서 우측에 버튼 */}
      <PageHeader
        title="일정 관리"
        subtitle="할 일을 작성하고 관리할 수 있어요."
        rightElement={
          <div className="desktop:hidden tablet:flex hidden items-center gap-x-2">
            <ScheduleActionButtons />
          </div>
        }
      />

      <ScheduleHeader />
      {children}
      <ScheduleModals dateString={dateString} />

      {/* 모바일 전용 하단 고정 바 */}
      <div className="tablet:hidden fixed right-0 bottom-23 left-0 flex w-full items-center justify-center gap-x-2 bg-white px-4 py-3">
        <ScheduleActionButtons mobile />
      </div>
    </div>
  )
}

export default function SchedulePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScheduleHeaderProvider>
      <SchedulePageContent>{children}</SchedulePageContent>
    </ScheduleHeaderProvider>
  )
}
