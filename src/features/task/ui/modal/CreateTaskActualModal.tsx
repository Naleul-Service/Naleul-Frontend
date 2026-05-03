'use client'

import { DesktopCreateTaskActualModal } from './desktop/DesktopCreateTaskActualModal'
import { MobileCreateTaskActualModal } from './mobile/MobileCreateTaskActualModal'

interface Props {
  isOpen: boolean
  onClose: () => void
  date: string
  defaultDate?: string
}

export function CreateTaskActualModal({ isOpen, onClose, date, defaultDate }: Props) {
  if (!isOpen) return null

  return (
    <>
      <div className="tablet:block desktop:block hidden">
        <DesktopCreateTaskActualModal isOpen={isOpen} onClose={onClose} date={date} defaultDate={defaultDate} />
      </div>
      <div className="tablet:hidden desktop:hidden block">
        <MobileCreateTaskActualModal onClose={onClose} date={date} defaultDate={defaultDate} />
      </div>
    </>
  )
}
