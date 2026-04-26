'use client'

import { usePathname } from 'next/navigation'

const EXCLUDED_PATHS = ['/login']

export function MobileBlock() {
  const pathname = usePathname()

  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) return null

  return (
    <div
      id="mobile-block"
      className="fixed inset-0 z-[9999] items-center justify-center gap-4 bg-white px-6 text-center"
      // ✅ flex-col 제거 — display는 CSS에서만 제어
    >
      <span className="text-4xl">💻</span>
      <h1 className="text-xl font-bold text-gray-900">PC에서 이용해주세요</h1>
      <p className="text-sm leading-relaxed text-gray-400">
        나를 서비스는 현재 PC 환경에서만 지원합니다.
        <br />더 나은 모바일 경험을 위해 준비 중이에요.
      </p>
    </div>
  )
}
