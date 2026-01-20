export interface SendMessagePayload {
  message: string
  workspaceId: string
  timezone: string
  boardId?: string
  threadId?: string
}
