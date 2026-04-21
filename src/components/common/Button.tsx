// src/ui/common/Button.tsx
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from '@/src/lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'iconSm' | 'iconMd' | 'iconLg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-800 disabled:bg-gray-100 disabled:text-gray-300',
  secondary: 'bg-primary-50 text-primary-400 hover:bg-primary-100 disabled:bg-gray-100 disabled:text-gray-300',
  outline:
    'border border-primary-400 text-primary-400 bg-white hover:bg-primary-50 disabled:bg-white disabled:text-gray-300',
  ghost: 'text-primary-500 bg-white hover:bg-primary-100 disabled:bg-white disabled:text-gray-300',
  danger: 'text-error-default bg-white hover:bg-error-dark disabled:bg-gray-100 disabled:text-gray-300',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-[32px] label-sm rounded-[6px] gap-x-2 px-[12px]',
  md: 'h-[40px] label-md rounded-[8px] gap-x-[6px] px-[16px]',
  lg: 'h-[48px] label-lg rounded-[10px] gap-x-1 px-[20px]',
  iconSm: 'h-[32px] w-[32px] rounded-[6px]',
  iconMd: 'h-[40px] w-[40px] rounded-[8px]',
  iconLg: 'h-[48px] w-[48px] rounded-[10px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          'focus-visible:ring-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size} />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

function Spinner({ size }: { size: Size }) {
  const spinnerSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <svg className={cn('animate-spin', spinnerSize)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
