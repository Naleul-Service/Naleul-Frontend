'use client'

import { Logo } from '@/src/assets/svgComponents'
import SidebarMenu from '@/src/components/layout/sidebar/SidebarMenu'
import { useUserStore } from '@/src/components/store/useUserStore'
import { useState } from 'react'

export default function MobileHeader() {
  const { user } = useUserStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div>
      <header className="fixed z-40 flex h-[48px] w-full items-center justify-between border-b border-gray-100 bg-white px-4">
        <Logo width={88} height={24} />
        {/* 유저 아바타 — 메뉴 트리거 */}
        <button onClick={() => setIsMenuOpen((v) => !v)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700">
            {user?.userName?.[0] ?? 'K'}
          </div>
        </button>
      </header>
      {/* 유저 메뉴 팝업 */}
      {isMenuOpen && (
        <div className="fixed top-12 right-0 z-50 w-[200px]">
          <SidebarMenu onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </div>
  )
}
