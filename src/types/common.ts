export interface ApiCallResult<T = never> {
  success: boolean
  message?: string
  data?: T
  error?: string
  status?: number
}
