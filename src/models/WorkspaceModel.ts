interface Workspace {
  id: string
  name: string
  userId: string
  order: number
  isDeleted: boolean
  isFavorite: boolean
  color: string
  createdAt: Date
  updatedAt: Date
}

export default class WorkspaceModel {
  public id: string
  public name: string
  public userId: string
  public order: number
  public isDeleted: boolean
  public isFavorite: boolean
  public color: string
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Workspace) {
    this.id = props.id
    this.name = props.name
    this.userId = props.userId
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.isFavorite = props.isFavorite
    this.color = props.color
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
