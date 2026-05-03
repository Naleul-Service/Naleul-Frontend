'use client'

import { DesktopAddTaskModal } from './desktop/DesktopAddTaskModal'
import { MobileAddTaskModal } from './mobile/MobileAddTaskModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultDate?: string
}

export function AddTaskModal({ isOpen, onClose, defaultDate }: Props) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopAddTaskModal isOpen={isOpen} onClose={onClose} defaultDate={defaultDate} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileAddTaskModal onClose={onClose} defaultDate={defaultDate} />
      </div>
    </>
  )
}
