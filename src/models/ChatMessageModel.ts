import { IChatMessage } from '@/interfaces/domain/IChatMessage'
import { IChatMessageRoles } from '@interfaces/IChatMessageRoles'

export default class ChatMessageModel implements IChatMessage {
  public id: string
  public role: IChatMessageRoles
  public content: any
  public listType?: 'workspace' | 'board' | 'category' | 'task'
  public userId: string
  public chatId: string
  public threadId: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IChatMessage) {
    this.id = props.id
    this.role = props.role
    this.content = props.content
    this.listType = props.listType
    this.userId = props.userId
    this.chatId = props.chatId
    this.threadId = props.threadId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
