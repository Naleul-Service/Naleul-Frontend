'use client'

import { Task } from '@/src/features/task/types'
import { DesktopTaskActualModal } from './desktop/DesktopTaskActualModal'
import { MobileTaskActualModal } from './mobile/MobileTaskActualModal'

interface Props {
  task: Task
  date: string
  onClose: () => void
}

export function TaskActualModal({ task, onClose }: Props) {
  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopTaskActualModal task={task} onClose={onClose} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileTaskActualModal task={task} onClose={onClose} />
      </div>
    </>
  )
}
