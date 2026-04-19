
export const kakaoLogin = async (code: string | null) => {
  try {
    if (!code) throw new Error('Authorization code not provided')

    const jwtResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/kakao/callback?code=${code}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!jwtResponse.ok) {
      const errorData = await jwtResponse.text()
      console.error('Auth API error:', errorData)
      throw new Error(`Failed to authenticate: ${jwtResponse.status}`)
    }

    const jwtResponseData: {
      data: {
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

    const { userId, accessToken, userName, userEmail, userRole } = jwtResponseData.data

    return {
      success: true,
      accessToken,
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
