'use client'

import { DesktopActualTaskEditModal } from './desktop/DesktopActualTaskEditModal'
import { MobileActualTaskEditModal } from './mobile/MobileActualTaskEditModal'
import { TaskActualItem } from '@/src/features/task/types'

interface Props {
  actual: TaskActualItem
  onClose: () => void
}

export function ActualTaskEditModal({ actual, onClose }: Props) {
  return (
    <>
      <div className="show-tablet">
        <DesktopActualTaskEditModal actual={actual} onClose={onClose} />
      </div>
      <div className="hide-tablet">
        <MobileActualTaskEditModal actual={actual} onClose={onClose} />
      </div>
    </>
  )
}
