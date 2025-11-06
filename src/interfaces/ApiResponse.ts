import ApiError from '@/interfaces/ApiError'
import { Nullable } from '@/types/utils'

export default interface ApiResponse<T = any> {
  success: boolean
  result: Nullable<T>
  error: Nullable<ApiError>
}
