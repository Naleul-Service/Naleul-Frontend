'use client'

import { useRouter } from 'next/navigation'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import { cn } from '@/src/lib/utils'
import { LogIn, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/src/components/store/useUserStore'

function clearAuthCookies() {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  document.cookie = `accessToken=;${expires}`
  document.cookie = `refreshToken=;${expires}`
  document.cookie = `userId=;${expires}`
  document.cookie = `userName=;${expires}`
  document.cookie = `role=;${expires}`
}

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`

const ROLE_LABEL: Record<string, string> = {
  FREE: '무료',
  PRO: 'PRO',
  ADMIN: '관리자',
}

export function SidebarFooter() {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)
  const { user, clearUser } = useUserStore()
  const router = useRouter()

  const handleLogout = () => {
    clearAuthCookies()
    clearUser()
    router.push('/')
  }

  if (!user) {
    return (
      <div className="border-border border-t p-2">
        <Link
          href={KAKAO_AUTH_URL}
          title={isCollapsed ? '카카오 로그인' : undefined}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2.5 text-sm',
            'text-muted-foreground hover:bg-muted hover:text-foreground transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <LogIn size={14} className="text-yellow-600" />
          </div>
          {!isCollapsed && <span>카카오 로그인</span>}
        </Link>
      </div>
    )
  }

  return (
    <div className="border-border border-t p-2">
      <div className={cn('flex items-center gap-2.5 rounded-md px-2 py-2', isCollapsed && 'justify-center')}>
        {/* 아바타 */}
        <div
          title={isCollapsed ? user.userName : undefined}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700"
        >
          {user.userName?.[0] ?? 'K'}
        </div>

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-foreground truncate text-sm font-medium">{user.userName}</p>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                    user.userRole === 'PRO' && 'bg-blue-100 text-blue-700',
                    user.userRole === 'ADMIN' && 'bg-red-100 text-red-700',
                    user.userRole === 'FREE' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {ROLE_LABEL[user.userRole] ?? user.userRole}
                </span>
              </div>
              <p className="text-muted-foreground truncate text-[11px]">{user.userEmail}</p>
            </div>

            {/* 로그아웃 */}
            <button
              onClick={handleLogout}
              title="로그아웃"
              className="text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-md p-1.5 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </>
        )}
      </div>

      {/* collapsed 상태 로그아웃 */}
      {isCollapsed && (
        <button
          onClick={handleLogout}
          title="로그아웃"
          className="text-muted-foreground hover:bg-muted mt-1 flex w-full items-center justify-center rounded-md p-1.5 transition-colors"
        >
          <LogOut size={14} />
        </button>
      )}
    </div>
  )
}
