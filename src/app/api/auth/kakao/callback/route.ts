// app/redirect/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { kakaoLogin } from '@/src/features/auth/api/authAPI'

const BASE_COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

const HTTP_ONLY_COOKIE_OPTIONS = {
  ...BASE_COOKIE_OPTIONS,
  httpOnly: true,
}

// ✅ cookies() store 대신 response.cookies에 직접 set
//    redirect Response와 쿠키가 동일한 응답에 담겨서 나감 → 타이밍 문제 해결
function setAuthCookiesToResponse(
  response: NextResponse,
  result: {
    accessToken?: string
    userId?: number
    userName?: string
    userEmail?: string
    userRole?: 'FREE' | 'PRO' | 'ADMIN'
  }
) {
  const { accessToken, userId, userName, userEmail, userRole } = result

  if (accessToken) response.cookies.set('accessToken', accessToken, HTTP_ONLY_COOKIE_OPTIONS)
  if (userRole) response.cookies.set('role', userRole, BASE_COOKIE_OPTIONS)
  if (userId !== undefined) response.cookies.set('memberId', String(userId), BASE_COOKIE_OPTIONS)
}

function getRedirectPathByRole(role: 'FREE' | 'PRO' | 'ADMIN' | undefined | null): string {
  switch (role) {
    case 'FREE':
      return '/'
    case 'PRO':
      return '/'
    case 'ADMIN':
      return '/'
    default:
      return '/'
  }
}

// 카카오 — GET으로 code 수신
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const baseUrl = request.nextUrl.origin

  const redirect = (pathname: string) => NextResponse.redirect(new URL(pathname, baseUrl))

  if (errorParam) return redirect(`/login?error=${encodeURIComponent(errorParam)}`)
  if (!code) return redirect('/login?error=no_code')

  try {
    const result = await kakaoLogin(code)
    console.log("카카오 로그인 결과", result.userId)

    // ✅ response 객체 먼저 생성 → 쿠키 담기 → 반환
    //    기존: setAuthCookies() → redirect() 순서로 타이밍 불일치 발생
    //    변경: 하나의 response에 쿠키 + redirect 함께 담아서 원자적으로 반환
    const response = redirect(getRedirectPathByRole(result.userRole))
    setAuthCookiesToResponse(response, {accessToken: result.accessToken, userEmail: result.userEmail, userId: result.userId, userName: result.userName, userRole: result.userRole})
    return response
  } catch (error) {
    console.error('GET callback error:', error)
    const message = error instanceof Error ? error.message : 'server_error'
    return redirect(`/login?error=${encodeURIComponent(message)}`)
  }
}
