import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
  CanceledError,
} from 'axios'
import type ApiResponse from '~/interfaces/ApiResponse'
import { ErrorsMessage } from '~/enums/ErrorsMessage'

let axiosClient: AxiosInstance | null = null

function getAxiosClient() {
  if (!axiosClient) {
    const config = useRuntimeConfig()

    axiosClient = axios.create({
      baseURL: config.public.serverApiUrl || 'https://kanway.ru/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    axiosClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse<any>>) => {
        const responseData = error.response?.data

        if (responseData && responseData.error) {
          const backendErrorPayload = responseData.error

          return Promise.reject(new BackendError(backendErrorPayload))
        }

        let message = ErrorsMessage.SERVER_ERROR
        let status: number | null = null
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
  }

  return axiosClient
}

export async function apiCall<T>(config: AxiosRequestConfig): Promise<T> {
  const axiosClient = getAxiosClient()
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
