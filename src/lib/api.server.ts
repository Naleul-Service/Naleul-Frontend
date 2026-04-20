/**
 * ⚠️ 서버 컴포넌트에서만 import 가능한 파일입니다
 * 'use client' 컴포넌트에서 import하지 마세요
 *
 * 예시:
 * // ✅ 좋음
 * // @/lib/api.server 사용
 *
 * // ❌ 나쁨
 * // 'use client' 컴포넌트에서 import
 */

import { getAccessTokenServer, refreshAccessTokenServer } from './auth.server'
import { parseJsonResponse } from './api'
import { ApiCallResult } from '@/src/types/common'

/**
 * 서버 사이드 API 요청 함수
 * accessToken을 자동으로 헤더에 추가하고
 * 401/403 에러 시 refreshToken으로 토큰 갱신 후 재시도하는 함수
 *
 * 사용 예:
 * const response = await apiFetchServer('/v1/user/profile')
 * const { data, error } = await apiCallServer<UserProfile>('/v1/user/profile')
 *
 * @param url - API 엔드포인트 (상대 경로)
 * @param options - fetch 옵션
 */
export const apiFetchServer = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const { ...fetchOptions } = options

  // 기본 설정
  const requestUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`
  const headers = new Headers(fetchOptions.headers || {})

  const accessToken = await getAccessTokenServer()
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  if (!headers.has('Content-Type') && fetchOptions.body) {
    if (!(fetchOptions.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json')
    }
  }

  let response = await fetch(requestUrl, {
    ...fetchOptions,
    headers,
    cache: 'no-store',
    ...(typeof window === 'undefined' ? {} : { credentials: 'include' as const }),
  })

  if (response.status === 401 || response.status === 403) {
    const refreshResult = await refreshAccessTokenServer()

    if (refreshResult.success && refreshResult.accessToken) {
      // 새 토큰으로 헤더 업데이트
      headers.set('Authorization', `Bearer ${refreshResult.accessToken}`)

      // 원래 요청 재시도
      response = await fetch(requestUrl, {
        ...fetchOptions,
        headers,
        cache: 'no-store',
        credentials: 'include' as const,
      })
    } else {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/cookies`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Failed to clear cookies:', error)
      }
    }
  }

  return response
}

/**
 * 더 간편한 서버 사이드 API 호출 래퍼
 * client 에서 fetch 함수 => next 서버 apiCallServer()함수 호출 => 이 함수에서 apiFetchServer()함수 호출
 * 자동 JSON 파싱 + 토큰 갱신 처리
 */
export const apiCallServer = async <T = never>(url: string, options: RequestInit = {}): Promise<ApiCallResult<T>> => {
  try {
    const response = await apiFetchServer(url, options)
    return await parseJsonResponse<T>(response)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
