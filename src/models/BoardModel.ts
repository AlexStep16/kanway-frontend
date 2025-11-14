import { IBoard } from '@interfaces/domain/IBoard'

export default class BoardModel implements IBoard {
  public id: string
  public name: string
  public workspaceId: string
  public workspaceName: string
  public userId: string
  public isFavorite: boolean
  public order: number
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public deletedTime?: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IBoard) {
    this.id = props.id
    this.name = props.name
    this.workspaceId = props.workspaceId
    this.workspaceName = props.workspaceName
    this.userId = props.userId
    this.isFavorite = props.isFavorite
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.deletedTime = props.deletedTime
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
