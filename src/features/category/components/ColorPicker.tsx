'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, Plus, X } from 'lucide-react'
import { Color } from '@/src/features/category/api/colors'
import { useDeleteColor } from '@/src/features/category/hooks/useDeleteColor'
import { useAddColor } from '@/src/features/category/hooks/useAddColor'
import { cn } from '@/src/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ColorPickerProps {
  colors: Color[]
  isLoading?: boolean
  selectedColorId: number | null
  onSelect: (colorId: number) => void
}

// ─── HSV ↔ HEX 변환 유틸 ──────────────────────────────────────────────────────

/** HSV(0-360, 0-1, 0-1) → "#RRGGBB" */
function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    const val = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(val * 255)
  }
  const r = f(5),
    g = f(3),
    b = f(1)
  return `#${[r, g, b]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()}`
}

/** "#RRGGBB" → HSV(0-360, 0-1, 0-1) */
function hexToHsv(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return [0, 0, 1]
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  const d = max - min
  let h = 0
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  const s = max === 0 ? 0 : d / max
  return [h, s, max]
}

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/

// ─── ColorDot ────────────────────────────────────────────────────────────────

function ColorDot({
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

// ─── ColorWheelPicker ────────────────────────────────────────────────────────

interface ColorWheelPickerProps {
  initialHex?: string
  onConfirm: (hex: string) => void
  onCancel: () => void
  isPending?: boolean
  existingColors: Color[]
}

function ColorWheelPicker({
  initialHex = '#FF0000',
  onConfirm,
  onCancel,
  isPending,
  existingColors,
}: ColorWheelPickerProps) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(initialHex))
  const [hexInput, setHexInput] = useState(initialHex.replace('#', '').toUpperCase())

  // AddColorInput 흡수 — 직접 hex 입력 상태
  const [directHex, setDirectHex] = useState('')

  // directHex가 유효한 hex가 되면 휠(HSV)도 동기화
  function handleDirectHexChange(raw: string) {
    const withHash = raw.startsWith('#') ? raw : '#' + raw
    setDirectHex(withHash)
    if (HEX_REGEX.test(withHash)) {
      const newHsv = hexToHsv(withHash)
      setHsv(newHsv)
      setHexInput(withHash.replace('#', '').toUpperCase())
    }
  }

  const paletteRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const isDraggingPalette = useRef(false)
  const isDraggingHue = useRef(false)

  const [h, s, v] = hsv
  const currentHex = hsvToHex(h, s, v)
  const hueColor = hsvToHex(h, 1, 1)

  // 휠 선택 중복 여부
  const isWheelDuplicate = existingColors.some((c) => c.colorCode.toLowerCase() === currentHex.toLowerCase())

  // 직접 입력 유효성
  const isDirectValidHex = HEX_REGEX.test(directHex)
  const isDirectDuplicate = existingColors.some((c) => c.colorCode.toLowerCase() === directHex.toLowerCase())
  const canDirectSubmit = isDirectValidHex && !isDirectDuplicate && !isPending

  // ── 팔레트 드래그 ──
  const handlePalettePointer = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      const el = paletteRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const newS = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
      const newV = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height))
      setHsv(([h]) => [h, newS, newV])
      setHexInput(hsvToHex(h, newS, newV).replace('#', '').toUpperCase())
    },
    [h]
  )

  // ── hue 슬라이더 드래그 ──
  const handleHuePointer = useCallback(
    (e: PointerEvent | React.PointerEvent) => {
      const el = hueRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const newH = Math.min(360, Math.max(0, ((e.clientX - rect.left) / rect.width) * 360))
      setHsv(([, s, v]) => [newH, s, v])
      setHexInput(hsvToHex(newH, s, v).replace('#', '').toUpperCase())
    },
    [s, v]
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (isDraggingPalette.current) handlePalettePointer(e)
      if (isDraggingHue.current) handleHuePointer(e)
    }
    const onUp = () => {
      isDraggingPalette.current = false
      isDraggingHue.current = false
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [handlePalettePointer, handleHuePointer])

  // 휠의 hex 입력 → HSV 역변환
  function handleWheelHexChange(raw: string) {
    const upper = raw.replace('#', '').toUpperCase()
    setHexInput(upper)
    const withHash = '#' + upper
    if (HEX_REGEX.test(withHash)) {
      setHsv(hexToHsv(withHash))
    }
  }

  // 직접 입력 제출
  function handleDirectSubmit() {
    if (!canDirectSubmit) return
    onConfirm(directHex.toUpperCase())
    setDirectHex('')
  }

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
        onPointerDown={(e) => {
          isDraggingPalette.current = true
          handlePalettePointer(e)
        }}
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
        onPointerDown={(e) => {
          isDraggingHue.current = true
          handleHuePointer(e)
        }}
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

      {/* 휠 → hex 입력 + 추가 버튼 */}
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
          onClick={() => onConfirm(currentHex)}
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

// ─── ColorPicker ─────────────────────────────────────────────────────────────

export function ColorPicker({ colors, isLoading = false, selectedColorId, onSelect }: ColorPickerProps) {
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor()
  const { mutate: addColor, isPending: isAdding } = useAddColor()
  const [showPicker, setShowPicker] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="bg-muted h-8 w-8 animate-pulse rounded-full" />
        ))}
      </div>
    )
  }

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

  // ── 컬러 휠 피커 뷰 ──
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

  // ── 기본 컬러 목록 뷰 ──
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
                  onDelete={() => deleteColor(color.userColorId)}
                />
              ))}
            </div>
          </>
        )}

        {/* + 버튼 */}
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
