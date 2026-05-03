'use client'

import { Plus } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { Color } from '@/src/features/color/types'
import { useColorPicker } from '@/src/features/color/hooks/useColorPicker'
import ColorDot from '@/src/features/color/ui/ColorDot'
import ColorWheelPicker from '@/src/features/color/ui/ColorWheelPicker'

interface ColorPickerProps {
  colors: Color[]
  isLoading?: boolean
  selectedColorId: number | null
  onSelect: (colorId: number) => void
}

export function ColorPicker({ colors, isLoading = false, selectedColorId, onSelect }: ColorPickerProps) {
  const {
    showPicker,
    setShowPicker,
    defaultColors,
    customColors,
    selectedColor,
    isAdding,
    isDeleting,
    handleConfirmColor,
    handleDeleteColor,
  } = useColorPicker({ colors, selectedColorId, onSelect })

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        ))}
      </div>
    )
  }

  if (showPicker) {
    return (
      <ColorWheelPicker
        onConfirm={handleConfirmColor}
        onCancel={() => setShowPicker(false)}
        isPending={isAdding}
        existingColors={colors}
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* 기본 색상 */}
      {defaultColors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {defaultColors.map((color) => (
            <ColorDot
              key={color.userColorId}
              color={color}
              isSelected={selectedColorId === color.userColorId}
              isDeleting={isDeleting}
              onSelect={() => onSelect(color.userColorId)}
            />
          ))}
        </div>
      )}

      {/* 커스텀 색상 + 추가 버튼 */}
      <div className="flex flex-col gap-1.5">
        {customColors.length > 0 && (
          <>
            <span className="caption-md text-gray-500">추가한 색상</span>
            <div className="flex flex-wrap gap-2">
              {customColors.map((color) => (
                <ColorDot
                  key={color.userColorId}
                  color={color}
                  isSelected={selectedColorId === color.userColorId}
                  isDeleting={isDeleting}
                  onSelect={() => onSelect(color.userColorId)}
                  onDelete={() => handleDeleteColor(color.userColorId)}
                />
              ))}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-gray-300',
            'text-gray-400 transition-colors hover:border-gray-400 hover:text-gray-600'
          )}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* 선택된 색상 표시 */}
      {selectedColor && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: selectedColor.colorCode }} />
          <span className="text-xs text-gray-400">{selectedColor.colorCode}</span>
        </div>
      )}
    </div>
  )
}
