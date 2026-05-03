// src/features/color/ui/ColorWheelPicker.tsx

'use client'

import { ChevronLeft } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { useColorWheelPicker } from '@/src/features/color/hooks/useColorWheelPicker'
import { Color } from '../types'

interface ColorWheelPickerProps {
  initialHex?: string
  onConfirm: (hex: string) => void
  onCancel: () => void
  isPending?: boolean
  existingColors: Color[]
}

export default function ColorWheelPicker({
  initialHex,
  onConfirm,
  onCancel,
  isPending,
  existingColors,
}: ColorWheelPickerProps) {
  const {
    h,
    s,
    v,
    currentHex,
    hueColor,
    hexInput,
    isWheelDuplicate,
    paletteRef,
    hueRef,
    handlePalettePointerDown,
    handleHuePointerDown,
    handleWheelHexChange,
    handleWheelConfirm,
  } = useColorWheelPicker({ initialHex, existingColors, isPending, onConfirm })

  return (
    <div className="flex flex-col gap-3">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <button type="button" onClick={onCancel} className="rounded-full p-1 hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4 text-gray-500" />
        </button>
        <span className="label-sm text-gray-600">색상 추가</span>
      </div>

      {/* Saturation/Value 팔레트 */}
      <div
        ref={paletteRef}
        className="relative h-[180px] w-full cursor-crosshair overflow-hidden rounded-[10px] select-none"
        style={{ backgroundColor: hueColor }}
        onPointerDown={handlePalettePointerDown}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to right, #fff, transparent)' }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to top, #000, transparent)' }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${s * 100}%`,
            top: `${(1 - v) * 100}%`,
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Hue 슬라이더 */}
      <div
        ref={hueRef}
        className="relative h-3 w-full cursor-pointer overflow-hidden rounded-full select-none"
        style={{
          background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
        }}
        onPointerDown={handleHuePointerDown}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{
            left: `${(h / 360) * 100}%`,
            backgroundColor: hueColor,
            boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
          }}
        />
      </div>

      {/* hex 입력 + 추가 버튼 */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 shrink-0 rounded-full border border-gray-200" style={{ backgroundColor: currentHex }} />
        <div className="flex flex-1 items-center overflow-hidden rounded-[8px] border border-gray-200 bg-white px-2 py-1.5">
          <span className="text-xs text-gray-400">#</span>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleWheelHexChange(e.target.value)}
            maxLength={6}
            className="ml-1 flex-1 bg-transparent text-sm text-gray-900 outline-none"
            placeholder="FF0000"
          />
        </div>
        <button
          type="button"
          disabled={isPending || isWheelDuplicate}
          onClick={handleWheelConfirm}
          className={cn(
            'shrink-0 rounded-[8px] px-3 py-1.5 text-sm font-medium transition-colors',
            isWheelDuplicate || isPending
              ? 'cursor-not-allowed bg-gray-100 text-gray-400'
              : 'bg-gray-900 text-white hover:bg-gray-700'
          )}
        >
          {isPending ? '추가 중…' : '추가'}
        </button>
      </div>

      {isWheelDuplicate && <p className="text-xs text-gray-400">이미 있는 색상이에요</p>}
    </div>
  )
}
