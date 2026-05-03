import { useRef, useState } from 'react'
import { cn } from '@/src/lib/utils'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface GeneralItemContextMenuProps {
  isMenuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function GeneralItemContextMenu({
  isMenuOpen,
  onMenuToggle,
  onMenuClose,
  onEdit,
  onDelete,
}: GeneralItemContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  useState(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onMenuClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  })

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation()
          onMenuToggle()
        }}
        className={cn(
          'text-muted-foreground hover:text-foreground rounded p-0.5 transition-opacity group-hover:opacity-100',
          isMenuOpen && 'opacity-100'
        )}
        aria-label="더 보기"
      >
        <MoreVertical size={16} className="text-gray-300" />
      </button>

      {isMenuOpen && (
        <div className="bg-background border-border animate-in fade-in-0 zoom-in-95 absolute top-full right-0 z-50 mt-1 min-w-[112px] rounded-lg border py-1 shadow-md duration-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
              onMenuClose()
            }}
            className="text-foreground hover:bg-muted flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors"
          >
            <Pencil size={12} />
            수정하기
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
              onMenuClose()
            }}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-3 py-2 text-xs transition-colors"
          >
            <Trash2 size={12} />
            삭제하기
          </button>
        </div>
      )}
    </div>
  )
}
