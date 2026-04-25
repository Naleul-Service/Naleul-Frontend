// features/category/ui/AddColorInput.tsx
'use client'

import { useState } from 'react'
import { useAddColor } from '../hooks/useAddColor'
import { Color } from '../api/colors'
import { Input } from '@/src/components/common/Input'
import { Button } from '@/src/components/common/Button'

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

        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="#FF5733"
          maxLength={7}
        />

        <Button
          className={'shrink-0'}
          variant={'primary'}
          size={'md'}
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? '추가 중…' : '추가'}
        </Button>
      </div>

      {/* 인라인 에러 - 타이핑 중일 때만 */}
      {value.length > 0 && !isValidHex && (
        <p className="text-destructive text-xs">#으로 시작하는 6자리 hex 코드를 입력해주세요</p>
      )}
      {isDuplicate && isValidHex && <p className="text-muted-foreground text-xs">이미 있는 색상이에요</p>}
    </div>
  )
}
