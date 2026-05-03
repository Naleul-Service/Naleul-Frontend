import { useState } from 'react'
import { Color } from '@/src/features/color/types'
import { useDeleteColor } from '@/src/features/color/hooks/useDeleteColor'
import { useAddColor } from '@/src/features/color/hooks/useAddColor'

interface UseColorPickerProps {
  colors: Color[]
  selectedColorId: number | null
  onSelect: (colorId: number) => void
}

export function useColorPicker({ colors, selectedColorId, onSelect }: UseColorPickerProps) {
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor()
  const { mutate: addColor, isPending: isAdding } = useAddColor()
  const [showPicker, setShowPicker] = useState(false)

  const defaultColors = colors.filter((c) => c.default)
  const customColors = colors.filter((c) => !c.default)
  const selectedColor = colors.find((c) => c.userColorId === selectedColorId)

  function handleConfirmColor(hex: string) {
    addColor(hex, {
      onSuccess: (newColor) => {
        setShowPicker(false)
        onSelect(newColor.userColorId)
      },
    })
  }

  function handleDeleteColor(colorId: number) {
    deleteColor(colorId)
  }

  return {
    showPicker,
    setShowPicker,
    defaultColors,
    customColors,
    selectedColor,
    isAdding,
    isDeleting,
    handleConfirmColor,
    handleDeleteColor,
  }
}
