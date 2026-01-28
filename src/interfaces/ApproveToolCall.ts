export interface ApproveToolCall {
  toolCallId: string
  chatMessageId: string
  boardId: string
  isConfirmed: boolean
  cancelledEntityIds: string[]
  isCancelled: boolean
  workspaceId: string
  timezone: string
}
