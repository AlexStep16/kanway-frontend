import { ICategory } from '@/interfaces/domain/ICategory'

export default class CategoryModel implements ICategory {
  public id: string
  public name: string
  public workspaceId: string
  public boardId: string
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
    this.boardId = props.boardId
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.deletedTime = props.deletedTime
    this.userId = props.userId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
