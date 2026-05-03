import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/src/lib/utils'
import { toDroppableId } from '@/src/features/category/constants'

export default function DroppableContainer({
  goalCategoryId,
  isEmpty,
  children,
}: {
  goalCategoryId: number
  isEmpty: boolean
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({ id: toDroppableId(goalCategoryId) })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col gap-1 px-2 pb-2 transition-colors',
        !isEmpty && 'border-t border-gray-100 pt-2',
        isEmpty && 'min-h-[32px] items-center justify-center',
        isOver && isEmpty && 'bg-muted rounded-b-lg'
      )}
    >
      {isEmpty && isOver && <p className="text-muted-foreground text-xs">여기에 놓기</p>}
      {!isEmpty && children}
    </div>
  )
}
