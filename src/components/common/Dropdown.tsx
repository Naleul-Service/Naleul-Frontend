// src/ui/common/Dropdown.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import Label from '@/src/components/common/Label'

export interface DropdownOption<T extends string | number = string | number> {
  label: string
  value: T
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[]
  value: T | null
  onChange: (value: T) => void
  placeholder?: string
  label?: string
  isRequired?: boolean
  error?: string
  disabled?: boolean
  className?: string
}

export function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  label,
  isRequired,
  error,
  disabled,
  className,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // 키보드 접근성
  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((v) => !v)
    }
    if (e.key === 'Escape') setIsOpen(false)
    if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault()
      const currentIndex = options.findIndex((o) => o.value === value)
      const nextIndex = Math.min(currentIndex + 1, options.length - 1)
      onChange(options[nextIndex].value)
    }
    if (e.key === 'ArrowUp' && isOpen) {
      e.preventDefault()
      const currentIndex = options.findIndex((o) => o.value === value)
      const prevIndex = Math.max(currentIndex - 1, 0)
      onChange(options[prevIndex].value)
    }
  }

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && <Label isRequired={isRequired}>{label}</Label>}

      <div ref={containerRef} className="relative">
        {/* 트리거 */}
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => setIsOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          className={cn(
            'input-default h-[48px] w-full rounded-[10px] border px-3 transition-colors outline-none',
            'flex items-center justify-between gap-2',
            'border-gray-200 bg-white',
            'hover:border-gray-300',
            'focus:border-primary-400 focus:ring-0',
            isOpen && 'border-primary-400',
            error && 'border-error-default bg-error-bg',
            'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100'
          )}
        >
          <span className={cn('body-md truncate', selectedOption ? 'text-gray-950' : 'text-gray-300')}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            className={cn('shrink-0 text-gray-400 transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </button>

        {/* 드롭다운 리스트 */}
        {isOpen && (
          <ul
            role="listbox"
            className={cn(
              'absolute z-50 mt-1 w-full overflow-hidden',
              'rounded-[10px] border border-gray-200 bg-white shadow-lg',
              'max-h-[240px] overflow-y-auto',
              // 스크롤바 스타일
              'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200'
            )}
          >
            {options.length === 0 ? (
              <li className="body-md px-3 py-3 text-gray-300">옵션이 없어요</li>
            ) : (
              options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'body-md flex cursor-pointer items-center px-3 py-3',
                    'transition-colors hover:bg-gray-50',
                    option.value === value && 'bg-primary-50 text-primary-400 font-medium'
                  )}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
