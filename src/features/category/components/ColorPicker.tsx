'use client'

import { Color } from '@/src/features/category/api/colors'
import { useDeleteColor } from '@/src/features/category/hooks/useDeleteColor'
import { cn } from '@/src/lib/utils'
import { X } from 'lucide-react'

interface ColorPickerProps {
  colors: Color[]
  isLoading?: boolean
  selectedColorId: number | null
  onSelect: (colorId: number) => void
}

export function ColorPicker({ colors, isLoading = false, selectedColorId, onSelect }: ColorPickerProps) {
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor()

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        ))}
      </div>
    )
  }

  const selectedColor = colors.find((c) => c.userColorId === selectedColorId)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div key={color.userColorId} className="group relative">
            <button
              type="button"
              title={color.colorCode}
              onClick={() => onSelect(color.userColorId)}
              disabled={isDeleting}
              className={cn(
                'h-8 w-8 rounded-full transition-all hover:scale-110 focus:outline-none disabled:opacity-50',
                selectedColorId === color.userColorId
                  ? 'ring-foreground scale-110 ring-2 ring-offset-2'
                  : 'ring-1 ring-transparent'
              )}
              style={{ backgroundColor: color.colorCode }}
            />

            {/* defaultColor가 false인 경우에만 삭제 버튼 노출 */}
            {!color.default && (
              <button
                type="button"
                title="색상 삭제"
                disabled={isDeleting}
                onClick={() => deleteColor(color.userColorId)}
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
        ))}
      </div>

      {selectedColor && (
        <div className="mt-1 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selectedColor.colorCode }} />
          <span className="text-muted-foreground text-xs">{selectedColor.colorCode}</span>
        </div>
      )}
    </div>
  )
}
