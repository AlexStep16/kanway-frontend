interface Board {
  id: string
  name: string
  workspaceId: string
  order: number
  isDeleted: boolean
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

export default class BoardModel {
  public id: string
  public name: string
  public workspaceId: string
  public order: number
  public isDeleted: boolean
  public isFavorite: boolean
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Board) {
    this.id = props.id
    this.name = props.name
    this.workspaceId = props.workspaceId
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.isFavorite = props.isFavorite
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
