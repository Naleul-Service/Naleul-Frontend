'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-8 rounded-[20px] border border-gray-100 bg-white px-8 py-12 shadow-sm">
        {/* 로고 또는 서비스명 */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="h2 text-gray-950">나를</h1>
          <p className="body-md text-gray-400">나의 하루를 기록하세요</p>
        </div>

        {/* 리다이렉트 시 안내 문구 */}
        {redirect && (
          <div className="bg-primary-50 w-full rounded-[10px] px-4 py-3 text-center">
            <p className="body-md-medium text-primary-400">로그인이 필요한 서비스예요</p>
            <p className="caption-md mt-0.5 text-gray-400">로그인 후 계속 이용하실 수 있어요</p>
          </div>
        )}

        {/* 카카오 로그인 버튼 */}
        <Link
          href={KAKAO_AUTH_URL}
          className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[#FEE500] px-4 py-[14px] transition-opacity hover:opacity-90"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 2C5.582 2 2 4.925 2 8.5c0 2.254 1.42 4.236 3.57 5.387L4.67 17.1a.25.25 0 0 0 .375.27L9.3 14.95c.231.017.464.05.7.05 4.418 0 8-2.925 8-6.5S14.418 2 10 2z"
              fill="#3C1E1E"
            />
          </svg>
          <span className="body-md-medium text-[#3C1E1E]">카카오로 시작하기</span>
        </Link>

        <p className="caption-md text-center text-gray-300">
          로그인 시 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
        </p>
      </div>
    </div>
  )
}
