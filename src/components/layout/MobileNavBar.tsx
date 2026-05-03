'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/src/lib/utils'
import { NAV_ITEMS } from '@/src/components/layout/sidebar/constants'

export function MobileNavBar() {
  const pathname = usePathname()

  // 로그인 페이지에서는 네비게이션 숨김
  if (pathname === '/login') return null

  return (
    <>
      {/* 하단 네비게이션 */}
      <nav className="fixed right-0 bottom-0 left-0 z-40 flex items-center border-t border-gray-100 bg-white px-4 pt-2 pb-8">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const href = item.getHref?.() ?? item.href

          return (
            <Link
              key={item.key}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-y-[2px] transition-colors',
                isActive ? 'text-primary-400' : 'text-gray-300'
              )}
            >
              <div
                className={`${isActive ? 'bg-primary-50' : ''} flex h-8 w-8 items-center justify-center rounded-[8px] transition-colors`}
              >
                {item.selectedIcon}
              </div>
              <span className={cn('label-md', isActive && 'font-semibold')}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
