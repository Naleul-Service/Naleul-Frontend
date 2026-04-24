'use client'

import { LogoutIcon } from '@/src/assets/svgComponents'
import { useUserStore } from '@/src/components/store/useUserStore'
import { useRouter } from 'next/navigation'
import Badge from '@/src/components/common/Badge'
import { useSidebarStore } from '@/src/components/store/useSidebarStore'
import Link from 'next/link'
import { cn } from '@/src/lib/utils'
import { ROLE_LABEL } from '@/src/components/layout/sidebar/constants'

async function clearAuthCookies() {
  const res = await fetch('/api/auth/cookies', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  const json = await res.json()

  console.log('postColor response:', json)

  if (!json.success) throw new Error(json.error ?? '쿠키 삭제 실패')
  return json.data
}

interface SidebarMenuProps {
  onClose: () => void
}

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`

export default function SidebarMenu({ onClose }: SidebarMenuProps) {
  const isCollapsed = useSidebarStore((s) => s.isCollapsed)

  const router = useRouter()
  const { user, clearUser } = useUserStore()

  const handleLogout = async () => {
    try {
      await clearAuthCookies()
      localStorage.clear()
      clearUser()
      onClose()
      window.location.href = '/'
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error)
      alert('로그아웃에 실패했습니다.')
    }
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
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-xs">카</div>
          {!isCollapsed && <span>카카오 로그인</span>}
        </Link>
      </div>
    )
  }

  return (
    <div className="z-50 min-w-[180px] rounded-[12px] border border-gray-100 bg-white p-1.5 shadow-[0_0_12px_0_rgba(17,26,31,0.10)]">
      {isCollapsed ? (
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border-b border-gray-100 px-3 py-2',
            isCollapsed && 'justify-center'
          )}
        >
          {/* 아바타 영역 클릭 시에도 메뉴 토글 (접혔을 때 유용) */}
          <div
            title={isCollapsed ? user.userName : undefined}
            className={cn(
              'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-yellow-100 text-xs font-medium text-yellow-700',
              isCollapsed && 'transition-all hover:ring-2 hover:ring-yellow-200'
            )}
          >
            {user.userName?.[0] ?? 'K'}
          </div>

          <div className="flex w-full justify-between">
            <div className="flex min-w-0 flex-col gap-y-[2px]">
              <div className="flex items-center gap-1.5">
                <p className="label-lg">{user.userName}</p>
                <Badge
                  opacity={90}
                  bgColor={
                    user.userRole === 'PRO'
                      ? 'bg-blue-100 text-blue-700'
                      : user.userRole === 'ADMIN'
                        ? 'bg-red-100 text-red-700'
                        : '#E0E7EA'
                  }
                  textColor={
                    user.userRole === 'PRO'
                      ? 'bg-blue-100 text-blue-700'
                      : user.userRole === 'ADMIN'
                        ? 'bg-red-100 text-red-700'
                        : '#475660'
                  }
                  type={'DEFAULT'}
                >
                  {ROLE_LABEL[user.userRole] ?? user.userRole}
                </Badge>
              </div>
              <p className="caption-sm truncate text-gray-300">{user.userEmail}</p>
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-x-2 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50"
      >
        <LogoutIcon width={20} height={20} />
        <span className="font-medium">로그아웃</span>
      </button>
    </div>
  )
}
