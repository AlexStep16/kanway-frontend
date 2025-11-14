export interface ICategory {
  id: string
  name: string
  workspaceId: string
  workspaceName: string
  boardId: string
  boardName: string
  userId: string
  order: number
  isDeleted: boolean
  isDeletedExternal: boolean
  deletedTime?: Date
  createdAt: Date
  updatedAt: Date
}
