export interface SendMessagePayload {
  message: string
  boardId: string
  workspaceId: string
  timezone: string
  threadId?: string
}
