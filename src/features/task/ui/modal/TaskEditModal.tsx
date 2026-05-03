'use client'

import { Task } from '@/src/features/task/types'
import { DesktopTaskEditModal } from './desktop/DesktopTaskEditModal'
import { MobileTaskEditModal } from './mobile/MobileTaskEditModal'

interface Props {
  task: Task
  onClose: () => void
}

export function TaskEditModal({ task, onClose }: Props) {
  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopTaskEditModal task={task} onClose={onClose} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileTaskEditModal task={task} onClose={onClose} />
      </div>
    </>
  )
}
