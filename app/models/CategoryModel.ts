import type { ICategory } from '~/interfaces/domain/ICategory'

export default class CategoryModel implements ICategory {
  public id: string
  public name: string
  public workspace: {
    id: string
    name: string
  }
  public board: {
    id: string
    name: string
  }
  public rank: string
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public deletedTime?: Date | null
  public userId: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: ICategory) {
    this.id = props.id
    this.name = props.name
    this.workspace = props.workspace
    this.board = props.board
    this.rank = props.rank
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.deletedTime = props.deletedTime
    this.userId = props.userId
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
