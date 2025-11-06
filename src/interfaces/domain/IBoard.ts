export interface IBoard {
  id: string
  name: string
  workspaceId: string
  userId: string
  isFavorite: boolean
  order: number
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
