// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login', '/signup']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 공개 경로면 통과
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const accessToken = req.cookies.get('accessToken')?.value
  const refreshToken = req.cookies.get('refreshToken')?.value

  // 둘 다 없으면 로그인 페이지로
  if (!accessToken && !refreshToken) {
    return redirectToLogin(req)
  }

  // accessToken 없고 refreshToken 있으면 재발급 시도
  if (!accessToken && refreshToken) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/token-reissue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization-Refresh': `Bearer ${refreshToken}`,
        },
      })

      if (!response.ok) {
        return redirectToLogin(req)
      }

      const newAccessToken = response.headers.get('authorization')?.replace('Bearer ', '')
      if (!newAccessToken) {
        return redirectToLogin(req)
      }

      // 재발급 성공 — 새 토큰을 쿠키에 설정하고 통과
      const res = NextResponse.next()
      res.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      })
      return res
    } catch {
      return redirectToLogin(req)
    }
  }

  return NextResponse.next()
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)'],
}
