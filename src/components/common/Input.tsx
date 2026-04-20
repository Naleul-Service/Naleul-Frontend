'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react'
import { Eye, EyeOff, Search, X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  helperText?: string
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  clearable?: boolean
  onClear?: () => void
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      type = 'text',
      className,
      disabled,
      value,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === 'password'
    const isSearch = type === 'search'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    const hasLeftIcon = !!leftIcon || isSearch
    const hasRightIcon = !!rightIcon || isPassword || (clearable && !!value)

    const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase()

    return (
      <div className="flex w-full flex-col gap-1.5">
        {/* 라벨 */}
        {label && (
          <label htmlFor={inputId} className={cn('text-foreground text-xs font-medium', disabled && 'opacity-50')}>
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}

        {/* 인풋 래퍼 */}
        <div className="relative flex items-center">
          {/* 왼쪽 아이콘 */}
          {hasLeftIcon && (
            <span className="text-muted-foreground pointer-events-none absolute left-3">
              {isSearch ? <Search size={15} /> : leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'bg-background text-foreground h-9 w-full text-sm',
              'border-border rounded-md border px-3',
              'placeholder:text-muted-foreground',
              'transition-colors outline-none',
              'hover:border-border-secondary',
              'focus:border-foreground focus:ring-foreground focus:ring-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-500',
              hasLeftIcon && 'pl-9',
              hasRightIcon && 'pr-9',
              className
            )}
            {...props}
          />

          {/* 오른쪽 — password 토글 */}
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="text-muted-foreground hover:text-foreground absolute right-3 transition-colors"
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          )}

          {/* 오른쪽 — clear 버튼 */}
          {!isPassword && clearable && !!value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onClear}
              className="text-muted-foreground hover:text-foreground absolute right-3 transition-colors"
              aria-label="입력 지우기"
            >
              <X size={15} />
            </button>
          )}

          {/* 오른쪽 — 커스텀 아이콘 (password/clear 없을 때만) */}
          {!isPassword && !(clearable && !!value) && rightIcon && (
            <span className="text-muted-foreground pointer-events-none absolute right-3">{rightIcon}</span>
          )}
        </div>

        {/* 에러 / 헬퍼 텍스트 */}
        {error ? (
          <p className="text-xs text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-muted-foreground text-xs">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
