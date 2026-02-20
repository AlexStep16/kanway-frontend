export interface SendMessagePayload {
  message: string
  workspaceId: string
  timezone: string
  jobId: string
  boardId?: string
  threadId?: string
}
