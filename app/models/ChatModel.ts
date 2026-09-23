import type { IChat } from '~/interfaces/domain/IChat'

export default class ChatModel implements IChat {
  public id: string
  public userId: string
  public threadId: string
  public workspaceId: string
  public name: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IChat) {
    this.id = props.id
    this.userId = props.userId
    this.threadId = props.threadId
    this.workspaceId = props.workspaceId
    this.name = props.name
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
