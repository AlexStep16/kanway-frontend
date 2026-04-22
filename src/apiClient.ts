import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  CanceledError,
} from 'axios'
import type ApiResponse from '@/interfaces/ApiResponse'
import { HttpError, BackendError, ClientAbortedError } from '@utils/errors'
import { ErrorsMessage } from './enums/ErrorsMessage'
import { Nullable } from '@/types/utils'
import { queryClient } from './plugins/queryClient'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<any>>) => {
    if (error.response?.status === 401) {
      queryClient.clear()
      localStorage.clear()

      return Promise.reject(new HttpError(ErrorsMessage.UNAUTHORIZED, 401))
    }

    const responseData = error.response?.data

    if (responseData && responseData.error) {
      const backendErrorPayload = responseData.error

      return Promise.reject(new BackendError(backendErrorPayload))
    }

    let message = ErrorsMessage.SERVER_ERROR
    let status: Nullable<number> = null
    let isNetworkError = false

    if (error instanceof CanceledError) {
      return Promise.reject(new ClientAbortedError(ErrorsMessage.CANCELLED))
    }

    if (error.response) {
      status = error.response.status
    } else if (error.request) {
      message = ErrorsMessage.NETWORK_ERROR
      isNetworkError = true
    }

    return Promise.reject(new HttpError(message, status, isNetworkError))
  },
)

export async function apiCall<T>(config: AxiosRequestConfig): Promise<T> {
  const response = (await axiosClient.request(config)) as AxiosResponse<ApiResponse<T>>
  const res = response.data

  if (!res.success) {
    if (res.error) {
      throw new BackendError(res.error)
    }
    throw new BackendError({ code: -1, description: ErrorsMessage.UNEXPECTED_ERROR })
  }

  return res.result as T
}
