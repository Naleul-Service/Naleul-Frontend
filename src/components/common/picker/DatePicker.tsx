// src/components/common/DatePicker.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { DayPicker } from '@/src/components/common/picker/DayPicker'
import Label from '@/src/components/common/Label'

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  label?: string
  isRequired?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export function DatePicker({ value, onChange, label, isRequired, error, disabled, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <div ref={containerRef} className="relative">
        <div
          onClick={() => !disabled && setIsOpen((v) => !v)}
          className={cn(
            'flex h-[48px] w-full items-center justify-between rounded-[10px] border px-3 transition-colors',
            'border-gray-200 bg-white text-sm text-gray-950',
            !disabled && 'cursor-pointer',
            isOpen && 'border-primary-400',
            error && 'border-error-default bg-error-bg',
            disabled && 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300'
          )}
        >
          <span>{value || <span className="text-gray-300">날짜 선택</span>}</span>
          <CalendarDays size={16} className={cn('mr-2', disabled ? 'text-gray-300' : 'text-gray-400')} />
        </div>

        {isOpen && (
          <div className="absolute top-[calc(100%+4px)] left-0 z-50 rounded-[12px] border border-gray-200 bg-white shadow-lg">
            <DayPicker
              currentDate={value || new Date().toISOString().split('T')[0]}
              onSelect={(date) => {
                onChange(date)
                setIsOpen(false)
              }}
            />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
