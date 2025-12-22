import { IChatMessage } from '@/interfaces/domain/IChatMessage'

export default class ChatMessageModel implements IChatMessage {
  public id: string
  public role: 'user' | 'assistant' | 'preview'
  public content: any
  public userId: string
  public chatId: string
  public threadId: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IChatMessage) {
    this.id = props.id
    this.role = props.role
    this.content = props.content
    this.userId = props.userId
    this.chatId = props.chatId
    this.threadId = props.threadId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
