'use client'

import { Color } from '@/src/features/category/api/colors'
import { cn } from '@/src/lib/utils'

interface ColorPickerProps {
  colors: Color[]
  isLoading?: boolean
  selectedColorId: number | null
  onSelect: (colorId: number) => void
}

export function ColorPicker({ colors, isLoading = false, selectedColorId, onSelect }: ColorPickerProps) {
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        ))}
      </div>
    )
  }

  const selectedColor = colors.find((c) => c.colorId === selectedColorId)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color.colorId}
            type="button"
            title={color.colorCode}
            onClick={() => onSelect(color.colorId)}
            className={cn(
              'h-8 w-8 rounded-full transition-all hover:scale-110 focus:outline-none',
              selectedColorId === color.colorId
                ? 'ring-foreground scale-110 ring-2 ring-offset-2'
                : 'ring-1 ring-transparent'
            )}
            style={{ backgroundColor: color.colorCode }}
          />
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
