import { GeneralCategoryItemType } from '@/src/features/category/api/goalCategory'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/src/lib/utils'
import { GripVertical } from 'lucide-react'
import GeneralItemContextMenu from '@/src/features/category/ui/GeneralItemContextMenu'

interface SortableGeneralCategoryItemProps {
  item: GeneralCategoryItemType
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function SortableGeneralCategoryItem({
  item,
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onDelete,
}: SortableGeneralCategoryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.generalCategoryId,
  })
  const isEtc = item.generalCategoryName === 'ETC'

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'group flex items-center justify-between rounded-[12px] px-[10px] py-3',
        'hover:bg-muted transition-colors',
        isDragging && 'opacity-40'
      )}
    >
      <section className="flex gap-x-[10px]">
        {!isEtc && (
          <button
            {...attributes}
            {...listeners}
            className="text-muted-foreground hover:text-foreground cursor-grab rounded p-0.5 transition-colors active:cursor-grabbing"
            aria-label="드래그 핸들"
          >
            <GripVertical size={16} className="text-gray-300" />
          </button>
        )}

        <section className="flex items-center gap-x-[10px]">
          <div
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: item.colorCode ? item.colorCode : '#BDC9CE' }}
          />
          <p className="body-md-medium flex-1 text-gray-950">{item.generalCategoryName}</p>
        </section>
      </section>

      {!isEtc && (
        <GeneralItemContextMenu
          isMenuOpen={isMenuOpen}
          onMenuToggle={onMenuToggle}
          onMenuClose={onMenuClose}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}
