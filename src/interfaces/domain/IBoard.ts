import { IParent } from '../IParent'

export interface IBoard {
  id: string
  name: string
  workspace: IParent
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
