import { AvailableColors } from '@/enums/AvailableColors'
import { IWorkspace } from '@interfaces/domain/IWorkspace'

export default class WorkspaceModel implements IWorkspace {
  public id: string
  public name: string
  public userId: string
  public isFavorite: boolean
  public boardsCount: number
  public categoriesCount: number
  public tasksCount: number
  public order: number
  public color: AvailableColors
  public colorName: string
  public isDeleted: boolean
  public deletedTime?: Date
  public createdAt: Date
  public updatedAt: Date

  constructor(props: IWorkspace) {
    this.id = props.id
    this.name = props.name
    this.userId = props.userId
    this.isFavorite = props.isFavorite
    this.boardsCount = props.boardsCount
    this.categoriesCount = props.categoriesCount
    this.tasksCount = props.tasksCount
    this.order = props.order
    this.color = props.color
    this.colorName = props.colorName
    this.isDeleted = props.isDeleted
    this.deletedTime = props.deletedTime
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
