// src/features/color/hooks/useColorWheelPicker.ts

import { useCallback, useEffect, useRef, useState } from 'react'
import { hexToHsv, hsvToHex } from '@/src/features/color/utils/color'
import { HEX_REGEX } from '@/src/features/color/constants'
import { Color } from '../types'

interface UseColorWheelPickerProps {
  initialHex?: string
  existingColors: Color[]
  isPending?: boolean
  onConfirm: (hex: string) => void
}

export function useColorWheelPicker({
  initialHex = '#FF0000',
  existingColors,
  isPending,
  onConfirm,
}: UseColorWheelPickerProps) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(initialHex))
  const [hexInput, setHexInput] = useState(initialHex.replace('#', '').toUpperCase())
  const [directHex, setDirectHex] = useState('')

  const paletteRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const isDraggingPalette = useRef(false)
  const isDraggingHue = useRef(false)

  const [h, s, v] = hsv
  const currentHex = hsvToHex(h, s, v)
  const hueColor = hsvToHex(h, 1, 1)

  // ── 유효성 ──
  const isWheelDuplicate = existingColors.some((c) => c.colorCode.toLowerCase() === currentHex.toLowerCase())
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

  // ── 전역 pointermove/pointerup ──
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

  // ── 핸들러 ──
  function handlePalettePointerDown(e: React.PointerEvent) {
    isDraggingPalette.current = true
    handlePalettePointer(e)
  }

  function handleHuePointerDown(e: React.PointerEvent) {
    isDraggingHue.current = true
    handleHuePointer(e)
  }

  function handleWheelHexChange(raw: string) {
    const upper = raw.replace('#', '').toUpperCase()
    setHexInput(upper)
    const withHash = '#' + upper
    if (HEX_REGEX.test(withHash)) {
      setHsv(hexToHsv(withHash))
    }
  }

  function handleDirectHexChange(raw: string) {
    const withHash = raw.startsWith('#') ? raw : '#' + raw
    setDirectHex(withHash)
    if (HEX_REGEX.test(withHash)) {
      setHsv(hexToHsv(withHash))
      setHexInput(withHash.replace('#', '').toUpperCase())
    }
  }

  function handleDirectSubmit() {
    if (!canDirectSubmit) return
    onConfirm(directHex.toUpperCase())
    setDirectHex('')
  }

  function handleWheelConfirm() {
    if (isPending || isWheelDuplicate) return
    onConfirm(currentHex)
  }

  return {
    // 상태
    h,
    s,
    v,
    currentHex,
    hueColor,
    hexInput,
    directHex,
    // 유효성
    isWheelDuplicate,
    isDirectValidHex,
    isDirectDuplicate,
    canDirectSubmit,
    // ref
    paletteRef,
    hueRef,
    // 핸들러
    handlePalettePointerDown,
    handleHuePointerDown,
    handleWheelHexChange,
    handleDirectHexChange,
    handleDirectSubmit,
    handleWheelConfirm,
  }
}
