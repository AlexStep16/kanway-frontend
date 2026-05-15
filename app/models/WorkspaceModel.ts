import { AvailableColors } from '~/enums/AvailableColors'
import type { IWorkspace } from '~/interfaces/domain/IWorkspace'

export default class WorkspaceModel implements IWorkspace {
  public id: string
  public name: string
  public userId: string
  public isFavorite: boolean
  public rank: string
  public color: AvailableColors
  public colorName: string
  public isDeleted: boolean
  public deletedTime?: Date | null
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IWorkspace) {
    this.id = props.id
    this.name = props.name
    this.userId = props.userId
    this.isFavorite = props.isFavorite
    this.rank = props.rank
    this.color = props.color
    this.colorName = props.colorName
    this.isDeleted = props.isDeleted
    this.deletedTime = props.deletedTime
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
