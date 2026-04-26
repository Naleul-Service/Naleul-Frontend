'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'
import { useUserStore } from '@/src/components/store/useUserStore'
import { useState } from 'react'
import SidebarMenu from '@/src/components/layout/sidebar/SidebarMenu'
import { NAV_ITEMS } from '@/src/components/layout/sidebar/constants'

export function MobileNavBar() {
  const pathname = usePathname()
  const { user } = useUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 로그인 페이지에서는 네비게이션 숨김
  if (pathname === '/login') return null
  
  return (
    <>
      {/* 하단 네비게이션 */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center border-t border-gray-100 bg-white">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const href = item.getHref?.() ?? item.href

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
                isActive ? 'text-primary-400' : 'text-gray-300'
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center">{item.selectedIcon}</div>
              <span className={cn('text-[10px]', isActive && 'font-semibold')}>{item.label}</span>
            </Link>
          )
        })}

        {/* 유저 아바타 — 메뉴 트리거 */}
        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700">
            {user?.userName?.[0] ?? 'K'}
          </div>
          <span className="text-[10px] text-gray-300">내 정보</span>
        </button>
      </nav>

      {/* 유저 메뉴 팝업 */}
      {isMenuOpen && (
        <div className="fixed right-0 bottom-16 z-50 w-[200px]">
          <SidebarMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  )
}
