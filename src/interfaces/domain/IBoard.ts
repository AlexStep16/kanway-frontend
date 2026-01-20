export interface IBoard {
  id: string
  name: string
  workspace: {
    id: string
    name: string
  }
  userId: string
  isFavorite: boolean
  categoriesCount: number
  tasksCount: number
  order: number
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
