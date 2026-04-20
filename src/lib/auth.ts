
interface AuthCallResult {
  success: boolean
  status?: string
  error?: string
  name?: string
  email?: string
  userId?: string
  accessToken?: string | undefined
  refreshToken?: string | undefined
  role?: 'EMPLOYER' | 'EMPLOYEE'
}

export const kakaoLogin = async (code: string | null) => {
  try {
    if (!code) throw new Error('Authorization code not provided')

    const jwtResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/kakao/callback?code=${code}&redirectUri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    console.log('jwtResponse', jwtResponse)

    if (!jwtResponse.ok) {
      const errorData = await jwtResponse.text()
      console.error('Auth API error:', errorData)
      throw new Error(`Failed to authenticate: ${jwtResponse.status}`)
    }

    const jwtResponseData: {
      data: {
        refreshToken: string
        accessToken: string
        userId: number
        userName: string
        userEmail: string,
        userRole: 'FREE' | 'PRO' | 'ADMIN'
      },
      message: string
      status: number
      success: boolean
    } = await jwtResponse.json()

    console.log('jwtResponseData', jwtResponseData)

    if (!jwtResponseData.success) {
      throw new Error(jwtResponseData.message || 'Authentication failed')
    }

    const { userId, accessToken, userName, userEmail, userRole, refreshToken } = jwtResponseData.data

    return {
      success: true,
      accessToken,
      refreshToken,
      userId,
      userName,
      userEmail,
      userRole,
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authentication failed',
    }
  }
}
