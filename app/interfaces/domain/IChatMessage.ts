import type { IChatMessageRoles } from '~/interfaces/IChatMessageRoles'

export interface IChatMessage {
  id: string
  role: IChatMessageRoles
  content: any
  iterationId: string
  listType?: 'workspace' | 'board' | 'column' | 'task'
  pendingToolCallId?: string
  creditsUsed?: number
  audioCreditsUsed?: number
  rating?: boolean
  tempId?: string
  userId: string
  chatId: string
  threadId: string
  createdAt: Date
  updatedAt: Date
}
