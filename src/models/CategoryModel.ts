interface Category {
  id: string
  name: string
  boardId: string
  order: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

export default class CategoryModel {
  public id: string
  public name: string
  public boardId: string
  public order: number
  public isDeleted: boolean
  public createdAt: Date
  public updatedAt: Date

  constructor(props: Category) {
    this.id = props.id
    this.name = props.name
    this.boardId = props.boardId
    this.order = props.order
    this.isDeleted = props.isDeleted
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
