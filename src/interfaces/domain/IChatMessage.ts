export interface IChatMessage {
  id: string
  role: 'user' | 'assistant' | 'preview'
  content: any
  userId: string
  chatId: string
  threadId: string
  createdAt: Date
  updatedAt: Date
}
