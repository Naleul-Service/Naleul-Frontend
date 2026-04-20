'use client'

import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/src/lib/utils'

type ModalSize = 'sm' | 'md' | 'lg' | 'full'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  size?: ModalSize
  hideCloseButton?: boolean
  closeOnOverlayClick?: boolean
  children: ReactNode
  footer?: ReactNode
  className?: string
}

const sizeStyles: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-[90vw]',
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  hideCloseButton = false,
  closeOnOverlayClick = true,
  children,
  footer,
  className,
}: ModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 오버레이 */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.18 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* 모달 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className={cn(
              'bg-background border-border relative z-10 w-full rounded-xl border shadow-lg',
              'flex max-h-[90vh] flex-col',
              sizeStyles[size],
              className
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 헤더 */}
            {(title || !hideCloseButton) && (
              <div className="border-border flex shrink-0 items-start justify-between border-b px-5 pt-5 pb-4">
                <div className="min-w-0 flex-1 pr-4">
                  {title && (
                    <h2 id="modal-title" className="text-foreground text-sm font-medium">
                      {title}
                    </h2>
                  )}
                  {description && <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>}
                </div>
                {!hideCloseButton && (
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-md p-1 transition-colors"
                    aria-label="모달 닫기"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

            {/* 푸터 */}
            {footer && <div className="border-border shrink-0 border-t px-5 pt-3 pb-5">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
