import { IBoard } from '@interfaces/domain/IBoard'

export default class BoardModel implements IBoard {
  public id: string
  public name: string
  public workspace: {
    id: string
    name: string
  }
  public userId: string
  public isFavorite: boolean
  public rank: string
  public isDeleted: boolean
  public isDeletedExternal: boolean
  public deletedTime?: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IBoard) {
    this.id = props.id
    this.name = props.name
    this.workspace = props.workspace
    this.userId = props.userId
    this.isFavorite = props.isFavorite
    this.rank = props.rank
    this.isDeleted = props.isDeleted
    this.isDeletedExternal = props.isDeletedExternal
    this.deletedTime = props.deletedTime
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
