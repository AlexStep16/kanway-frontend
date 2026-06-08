import type { IChatMessage } from '~/interfaces/domain/IChatMessage'
import type { IChatMessageRoles } from '~/interfaces/IChatMessageRoles'

export default class ChatMessageModel implements IChatMessage {
  public id: string
  public role: IChatMessageRoles
  public content: any
  public tempId?: string
  public listType?: 'workspace' | 'board' | 'column' | 'task'
  public pendingToolCallId?: string
  public creditsUsed?: number
  public rating?: boolean
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
    this.pendingToolCallId = props.pendingToolCallId
    this.creditsUsed = props.creditsUsed
    this.rating = props.rating
    this.userId = props.userId
    this.chatId = props.chatId
    this.threadId = props.threadId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
