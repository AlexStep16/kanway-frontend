import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import type ApiResponse from '@/interfaces/ApiResponse' // Предполагаем, что этот интерфейс содержит {success, result, error}
import { HttpError, BackendError } from '@utils/errors' // Импортируем наши новые ошибки
import { ErrorsMessage } from './enums/ErrorsMessage'

const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<any>>) => {
    const responseData = error.response?.data

    if (responseData && responseData.error) {
      const backendErrorPayload = responseData.error

      return Promise.reject(new BackendError(backendErrorPayload))
    }

    let message = ErrorsMessage.SERVER_ERROR
    let status: number | null = null
    let isNetworkError = false

    if (error.response) {
      status = error.response.status
      // Дополнительная логика для 401, если нужно
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
