import type ApiError from '~/interfaces/ApiError'

export default interface ApiResponse<T = any> {
  success: boolean
  result: T | null
  error: ApiError | null
}
