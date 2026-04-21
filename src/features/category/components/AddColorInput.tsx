// features/category/ui/AddColorInput.tsx
'use client'

import { useState } from 'react'
import { useAddColor } from '../hooks/useAddColor'
import { Color } from '../api/colors'

interface AddColorInputProps {
  existingColors: Color[]
  onAdded?: (color: Color) => void
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

export function AddColorInput({ existingColors, onAdded }: AddColorInputProps) {
  const [value, setValue] = useState('')
  const { mutate, isPending } = useAddColor()

  const isDuplicate = existingColors.some((c) => c.colorCode.toLowerCase() === value.toLowerCase())
  const isValidHex = HEX_REGEX.test(value)
  const canSubmit = isValidHex && !isDuplicate && !isPending

  const handleSubmit = () => {
    if (!canSubmit) return
    mutate(value, {
      onSuccess: (newColor) => {
        setValue('')
        onAdded?.(newColor)
      },
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {/* 미리보기 */}
        <div
          className="border-border h-8 w-8 shrink-0 rounded-full border transition-colors"
          style={{ backgroundColor: isValidHex ? value : 'transparent' }}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="#FF5733"
          maxLength={7}
          className="border-border focus:ring-foreground h-8 flex-1 rounded-md border bg-transparent px-2 text-sm focus:ring-1 focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="bg-foreground text-background h-8 rounded-md px-3 text-xs disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? '추가 중…' : '추가'}
        </button>
      </div>

      {/* 인라인 에러 - 타이핑 중일 때만 */}
      {value.length > 0 && !isValidHex && (
        <p className="text-destructive text-xs">#으로 시작하는 6자리 hex 코드를 입력해주세요</p>
      )}
      {isDuplicate && isValidHex && <p className="text-muted-foreground text-xs">이미 있는 색상이에요</p>}
    </div>
  )
}
