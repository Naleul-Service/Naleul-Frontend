'use client'

import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
              'bg-background relative z-10 flex w-full flex-col gap-y-[16px] rounded-[16px] border border-gray-100 p-6 shadow-lg',
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
              <div className="flex shrink-0 items-start justify-between border-b border-gray-100 pb-[16px]">
                <div className="min-w-0 flex-1 gap-y-1">
                  {title && (
                    <h2 id="modal-title" className="h3 text-gray-950">
                      {title}
                    </h2>
                  )}
                  {description && <p className="caption-md text-gray-500">{description}</p>}
                </div>
              </div>
            )}

            {/* 본문 */}
            <div className="flex-1 overflow-y-auto">{children}</div>

            {/* 푸터 */}
            {footer && <div className="shrink-0 pt-[16px]">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
