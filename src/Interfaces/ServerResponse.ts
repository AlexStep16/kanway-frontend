interface ServerResponse<T> {
  result: T
  success: boolean
  error: {
    code: number
    description: string
  }
}

export { ServerResponse }