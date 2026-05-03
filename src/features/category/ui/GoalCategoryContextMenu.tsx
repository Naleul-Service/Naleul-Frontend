'use client'

import { useRef } from 'react'
import { CheckCircle, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/src/lib/utils'
import { useClickOutside } from '@/src/features/category/hooks/useClickoutside'

interface MenuAction {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

interface GoalCategoryContextMenuProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  onEdit: () => void
  onComplete: () => void
  onDelete: () => void
  isCompleted: boolean
}

export function GoalCategoryContextMenu({
  isOpen,
  onToggle,
  onClose,
  onEdit,
  onComplete,
  onDelete,
  isCompleted,
}: GoalCategoryContextMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, onClose, isOpen)

  const actions: MenuAction[] = [
    {
      label: '수정하기',
      icon: <Pencil size={13} />,
      onClick: () => {
        onEdit()
        onClose()
      },
    },
    ...(!isCompleted
      ? [
          {
            label: '목표 완료',
            icon: <CheckCircle size={13} />,
            onClick: () => {
              onComplete()
              onClose()
            },
          },
        ]
      : []),
    {
      label: '삭제하기',
      icon: <Trash2 size={13} />,
      onClick: () => {
        onDelete()
        onClose()
      },
      variant: 'danger' as const,
    },
  ]

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        className={cn(
          'text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-1 transition-colors',
          isOpen && 'bg-muted text-foreground'
        )}
        aria-label="더 보기"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical size={14} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'bg-background border-border absolute top-full right-0 z-50 mt-1 min-w-[128px] rounded-lg border py-1 shadow-md',
            // 작은 애니메이션
            'animate-in fade-in-0 zoom-in-95 duration-100'
          )}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              role="menuitem"
              onClick={(e) => {
                e.stopPropagation()
                action.onClick()
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors',
                action.variant === 'danger'
                  ? 'text-destructive hover:bg-destructive/10'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
