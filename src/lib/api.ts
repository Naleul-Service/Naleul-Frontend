import { ApiCallResult } from '@/src/types/common'

/**
 * JSON 응답을 파싱하는 헬퍼 함수
 * 백엔드 응답 형식: { code, isSuccess, message, result }
 *
 * 클라이언트 & 서버 양쪽에서 사용 가능
 */
export const parseJsonResponse = async <T = never>(
  response: Response,
): Promise<ApiCallResult<T>> => {
  try {
    const rawData = await response.json()

    // 성공 응답: isSuccess = true
    const data = rawData as ApiCallResult<T>
    if (data.success) {
      return {
        success: true,
        message: data.message,
        data: data.data,
        status: data.status,
      }
    }
    return {
      success: false,
      message: data.message,
      status: data.status,
      error: data.message,
    }

    // 실패 응답: isSuccess = false
  } catch (error) {
    // JSON 파싱 실패 또는 네트워크 에러
    let errorMessage = `HTTP Error: ${response.status}`

    try {
      const errorText = await response.text()
      if (errorText) {
        errorMessage = errorText
      }
    } catch {
      // response.text() 실패 시 무시
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
}
