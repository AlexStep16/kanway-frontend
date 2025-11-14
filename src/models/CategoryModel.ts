import { ICategory } from '@interfaces/domain/ICategory'

export default class CategoryModel implements ICategory {
  public id: string
  public name: string
  public workspaceId: string
  public workspaceName: string
  public boardId: string
  public boardName: string
  public order: number
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public deletedTime?: Date
  public userId: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: ICategory) {
    this.id = props.id
    this.name = props.name
    this.workspaceId = props.workspaceId
    this.workspaceName = props.workspaceName
    this.boardId = props.boardId
    this.boardName = props.boardName
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.deletedTime = props.deletedTime
    this.userId = props.userId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
