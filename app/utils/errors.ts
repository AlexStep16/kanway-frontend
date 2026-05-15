export interface BackendErrorPayload {
  code: number
  description: string
  details?: any
}

export class BackendError extends Error {
  public code: number
  public details?: any

  constructor(payload: BackendErrorPayload) {
    super(payload.description)
    this.name = 'BackendError'
    this.code = payload.code
    this.details = payload.details

    Object.setPrototypeOf(this, BackendError.prototype)
  }
}

export class HttpError extends Error {
  public status: number | null
  public isNetworkError: boolean = false

  constructor(message: string, status: number | null = null, isNetworkError: boolean = false) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.isNetworkError = isNetworkError

    Object.setPrototypeOf(this, HttpError.prototype)
  }
}

export class ClientAbortedError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ClientAbortedError.prototype)
  }
}
