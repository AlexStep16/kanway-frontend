import { IChatMessageRoles } from '@interfaces/IChatMessageRoles'

export interface IChatMessage {
  id: string
  role: IChatMessageRoles
  content: any
  listType?: 'workspace' | 'board' | 'category' | 'task'
  userId: string
  chatId: string
  threadId: string
  createdAt: Date
  updatedAt: Date
}
