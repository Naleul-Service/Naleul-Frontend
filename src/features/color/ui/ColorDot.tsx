import { cn } from '@/src/lib/utils'
import { X } from 'lucide-react'
import { Color } from '../types'

export default function ColorDot({
  color,
  isSelected,
  isDeleting,
  onSelect,
  onDelete,
}: {
  color: Color
  isSelected: boolean
  isDeleting: boolean
  onSelect: () => void
  onDelete?: () => void
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        title={color.colorCode}
        onClick={onSelect}
        disabled={isDeleting}
        className={cn(
          'h-8 w-8 rounded-full transition-all hover:scale-110 focus:outline-none disabled:opacity-50',
          isSelected ? 'ring-foreground scale-110 ring-2 ring-offset-2' : 'ring-1 ring-transparent'
        )}
        style={{ backgroundColor: color.colorCode }}
      />
      {onDelete && (
        <button
          type="button"
          title="색상 삭제"
          disabled={isDeleting}
          onClick={onDelete}
          className={cn(
            'bg-background border-border absolute -top-1 -right-1 hidden h-4 w-4',
            'items-center justify-center rounded-full border',
            'hover:bg-destructive hover:text-destructive-foreground',
            'group-hover:flex focus:outline-none disabled:cursor-not-allowed'
          )}
        >
          <X className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  )
}
