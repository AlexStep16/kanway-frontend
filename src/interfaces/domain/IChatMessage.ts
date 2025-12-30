import { IChatMessageRoles } from '@interfaces/IChatMessageRoles'

export interface IChatMessage {
  id: string
  role: IChatMessageRoles
  content: any
  listType?: string
  userId: string
  chatId: string
  threadId: string
  createdAt: Date
  updatedAt: Date
}
